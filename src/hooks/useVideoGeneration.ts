"use client";

import { useState, useCallback } from 'react';
import { VideoJob } from '@/types/video';

export function useVideoGeneration() {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addJob = useCallback((newJob: VideoJob) => {
    setJobs(prev => [newJob, ...prev]);
    setIsGenerating(true);
  }, []);

  const updateJob = useCallback((updatedJob: VideoJob) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      )
    );

    // Stop generating state when job is completed or failed
    if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
      setIsGenerating(false);
    }
  }, []);

  const getActiveJob = useCallback(() => {
    return jobs.find(job => 
      job.status === 'pending' || job.status === 'processing'
    );
  }, [jobs]);

  const getCompletedJobs = useCallback(() => {
    return jobs.filter(job => job.status === 'completed');
  }, [jobs]);

  const getFailedJobs = useCallback(() => {
    return jobs.filter(job => job.status === 'failed');
  }, [jobs]);

  return {
    jobs,
    isGenerating,
    addJob,
    updateJob,
    getActiveJob,
    getCompletedJobs,
    getFailedJobs,
  };
}