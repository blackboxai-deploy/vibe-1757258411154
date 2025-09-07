import { NextRequest, NextResponse } from 'next/server';
import { VideoGenerationRequest, VideoGenerationResponse } from '@/types/video';
import { setJob, updateJob } from '@/lib/mock-storage';

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();
    
    // Basic validation
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (body.length_seconds < 1 || body.length_seconds > 30) {
      return NextResponse.json(
        { error: 'Length must be between 1-30 seconds' },
        { status: 400 }
      );
    }

    if (body.fps < 1 || body.fps > 30) {
      return NextResponse.json(
        { error: 'FPS must be between 1-30' },
        { status: 400 }
      );
    }

    // Generate job ID
    const jobId = Math.random().toString(36).substring(2, 10);
    const createdAt = new Date().toISOString();

    // Store job data
    setJob(jobId, {
      job_id: jobId,
      prompt: body.prompt,
      parameters: {
        length_seconds: body.length_seconds,
        fps: body.fps,
        width: body.width || 512,
        height: body.height || 512,
      },
      status: 'pending',
      ready: false,
      progress: 0,
      files: [],
      created_at: createdAt,
    });

    // Simulate processing in background
    setTimeout(() => {
      updateJob(jobId, { status: 'processing', progress: 25 });
    }, 1000);

    setTimeout(() => {
      updateJob(jobId, { status: 'processing', progress: 50 });
    }, 3000);

    setTimeout(() => {
      updateJob(jobId, { status: 'processing', progress: 75 });
    }, 5000);

    setTimeout(() => {
      updateJob(jobId, {
        status: 'completed',
        ready: true,
        progress: 100,
        completed_at: new Date().toISOString(),
        files: ['output.mp4']
      });
    }, 8000);

    const response: VideoGenerationResponse = {
      job_id: jobId,
      status_url: `/api/status/${jobId}`,
      download_url: `/api/download/${jobId}`,
      created_at: createdAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}