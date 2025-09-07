// Mock in-memory storage for development
// In production, this would be replaced with a database

interface JobData {
  job_id: string;
  prompt: string;
  parameters: {
    length_seconds: number;
    fps: number;
    width: number;
    height: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ready: boolean;
  progress: number;
  files: string[];
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

// Global jobs storage
const jobs = new Map<string, JobData>();

export function getJob(jobId: string): JobData | undefined {
  return jobs.get(jobId);
}

export function setJob(jobId: string, jobData: JobData): void {
  jobs.set(jobId, jobData);
}

export function updateJob(jobId: string, updates: Partial<JobData>): void {
  const job = jobs.get(jobId);
  if (job) {
    jobs.set(jobId, { ...job, ...updates });
  }
}

export function getAllJobs(): Map<string, JobData> {
  return jobs;
}

export { jobs };