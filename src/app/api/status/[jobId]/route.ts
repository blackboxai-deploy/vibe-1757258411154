import { NextRequest, NextResponse } from 'next/server';
import { JobStatus } from '@/types/video';
import { getJob } from '@/lib/mock-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get job from storage
    const job = getJob(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const status: JobStatus = {
      job_id: job.job_id,
      ready: job.ready,
      status: job.status,
      progress: job.progress,
      files: job.files,
      created_at: job.created_at,
      completed_at: job.completed_at,
      error_message: job.error_message,
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}