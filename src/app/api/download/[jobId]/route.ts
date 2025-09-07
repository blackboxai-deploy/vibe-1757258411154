import { NextRequest, NextResponse } from 'next/server';
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

    const job = getJob(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (!job.ready || job.status !== 'completed') {
      return NextResponse.json(
        { error: 'Video not ready yet' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Read the actual video file from disk/cloud storage
    // 2. Stream it back to the client
    
    // For demo purposes, return a mock response
    const mockVideoData = new Uint8Array(Buffer.from('mock video data for ' + jobId));
    
    return new NextResponse(mockVideoData, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${jobId}.mp4"`,
        'Content-Length': mockVideoData.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}