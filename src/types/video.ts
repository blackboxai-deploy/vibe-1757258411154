export interface VideoGenerationRequest {
  prompt: string;
  length_seconds: number;
  fps: number;
  width: number;
  height: number;
  seed?: number;
}

export interface VideoGenerationResponse {
  job_id: string;
  status_url: string;
  download_url: string;
  created_at: string;
}

export interface JobStatus {
  job_id: string;
  ready: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  files: string[];
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface VideoJob {
  id: string;
  prompt: string;
  status: JobStatus['status'];
  progress: number;
  created_at: string;
  completed_at?: string;
  download_url?: string;
  error_message?: string;
  parameters: {
    length_seconds: number;
    fps: number;
    width: number;
    height: number;
  };
}

export interface GenerationFormData {
  prompt: string;
  length_seconds: number;
  fps: number;
  width: number;
  height: number;
}