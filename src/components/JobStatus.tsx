"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VideoJob } from '@/types/video';
import { getJobStatus, getDownloadUrl } from '@/lib/api';

interface JobStatusProps {
  job: VideoJob;
  onStatusUpdate: (job: VideoJob) => void;
}

export default function JobStatus({ job, onStatusUpdate }: JobStatusProps) {
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isPolling || job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const pollStatus = async () => {
      try {
        const status = await getJobStatus(job.id);
        
        const updatedJob: VideoJob = {
          ...job,
          status: status.status,
          progress: status.progress || 0,
          completed_at: status.completed_at,
          error_message: status.error_message,
          download_url: status.ready ? getDownloadUrl(job.id) : undefined,
        };

        onStatusUpdate(updatedJob);

        if (status.ready || status.status === 'completed') {
          setIsPolling(false);
        } else if (status.status === 'failed') {
          setIsPolling(false);
          setError(status.error_message || 'Generation failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Status check failed');
        setIsPolling(false);
      }
    };

    // Initial check
    pollStatus();

    // Continue polling every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [job, isPolling, onStatusUpdate]);

  const getStatusIcon = () => {
    switch (job.status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🎬';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📝';
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'pending':
        return 'Queued for processing...';
      case 'processing':
        return 'Generating Minecraft video...';
      case 'completed':
        return 'Video ready for download!';
      case 'failed':
        return 'Generation failed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDownload = () => {
    if (job.download_url) {
      const link = document.createElement('a');
      link.href = job.download_url;
      link.download = `minecraft-video-${job.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStatusIcon()}</span>
            <span>Job: {job.id}</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </CardTitle>
        <CardDescription className="truncate">
          {job.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Duration:</strong> {job.parameters.length_seconds}s
          </div>
          <div>
            <strong>FPS:</strong> {job.parameters.fps}
          </div>
          <div>
            <strong>Resolution:</strong> {job.parameters.width}×{job.parameters.height}
          </div>
          <div>
            <strong>Created:</strong> {formatTime(job.created_at)}
          </div>
        </div>

        {job.status === 'completed' && job.download_url && (
          <div className="pt-4 border-t">
            <Button 
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              📥 Download Video
            </Button>
          </div>
        )}

        {job.status === 'failed' && (
          <Alert variant="destructive">
            <AlertDescription>
              {job.error_message || 'Video generation failed. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}