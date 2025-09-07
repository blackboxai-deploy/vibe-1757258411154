"use client";

import { VideoJob } from '@/types/video';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JobHistoryProps {
  jobs: VideoJob[];
}

export default function JobHistory({ jobs }: JobHistoryProps) {
  if (jobs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>📜 Generation History</CardTitle>
          <CardDescription>
            Your video generation history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🎬</div>
            <p>No videos generated yet</p>
            <p className="text-sm">Start by creating your first Minecraft video!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: VideoJob['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: '⏳ Pending' },
      processing: { variant: 'default' as const, label: '🎬 Processing' },
      completed: { variant: 'default' as const, label: '✅ Completed' },
      failed: { variant: 'destructive' as const, label: '❌ Failed' },
    };

    const config = variants[status] || variants.pending;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDownload = (job: VideoJob) => {
    if (job.download_url) {
      const link = document.createElement('a');
      link.href = job.download_url;
      link.download = `minecraft-video-${job.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📜 Generation History</span>
          <Badge variant="outline">{jobs.length} video{jobs.length !== 1 ? 's' : ''}</Badge>
        </CardTitle>
        <CardDescription>
          Track your Minecraft video creations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border border-border/50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {job.id}
                      </span>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <p className="text-sm mb-3 line-clamp-2">
                      {job.prompt}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>⏱️ {job.parameters.length_seconds}s</span>
                      <span>🎞️ {job.parameters.fps} FPS</span>
                      <span>📐 {job.parameters.width}×{job.parameters.height}</span>
                      <span>📅 {formatDate(job.created_at)}</span>
                    </div>
                    
                    {job.status === 'processing' && (
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    {job.status === 'completed' && job.download_url ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(job)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        📥 Download
                      </Button>
                    ) : job.status === 'failed' ? (
                      <Button size="sm" variant="outline" disabled>
                        ❌ Failed
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        ⏳ Processing
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}