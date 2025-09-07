import { VideoGenerationRequest, VideoGenerationResponse, JobStatus } from '@/types/video';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:3000';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(response.status, errorText || 'Request failed');
  }

  return response.json();
}

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  return apiRequest<VideoGenerationResponse>('/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  return apiRequest<JobStatus>(`/status/${jobId}`);
}

export async function downloadVideo(jobId: string): Promise<Blob> {
  const url = `${API_BASE_URL}/api/download/${jobId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new APIError(response.status, 'Download failed');
  }
  
  return response.blob();
}

export function getDownloadUrl(jobId: string): string {
  return `${API_BASE_URL}/api/download/${jobId}`;
}

export async function pollJobStatus(
  jobId: string,
  onUpdate: (status: JobStatus) => void,
  onComplete: (status: JobStatus) => void,
  onError: (error: Error) => void
): Promise<void> {
  const poll = async () => {
    try {
      const status = await getJobStatus(jobId);
      onUpdate(status);
      
      if (status.ready || status.status === 'completed') {
        onComplete(status);
        return;
      }
      
      if (status.status === 'failed') {
        onError(new Error(status.error_message || 'Generation failed'));
        return;
      }
      
      // Continue polling with exponential backoff
      setTimeout(poll, Math.min(5000, 1000 * Math.pow(1.5, 3))); // Max 5 seconds
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };
  
  poll();
}