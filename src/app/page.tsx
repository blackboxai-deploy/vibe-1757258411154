"use client";

import VideoGenerationForm from '@/components/VideoGenerationForm';
import JobStatus from '@/components/JobStatus';
import JobHistory from '@/components/JobHistory';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const { jobs, isGenerating, addJob, updateJob, getActiveJob } = useVideoGeneration();
  const activeJob = getActiveJob();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
          <span>🎮</span>
          AI-Powered Video Generation
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Transform Text into
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Minecraft Adventures
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe your Minecraft scene and watch our AI bring it to life with cinematic video generation. 
          Create epic adventures, peaceful builds, or thrilling escapes!
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">
            🎬 Generate Video
          </TabsTrigger>
          <TabsTrigger value="history" className="relative">
            📜 History
            {jobs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {jobs.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-8">
          <VideoGenerationForm 
            onJobCreated={addJob}
            isGenerating={isGenerating}
          />
          
          {activeJob && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">🎬 Current Generation</h2>
                <p className="text-gray-600">
                  Your Minecraft video is being crafted...
                </p>
              </div>
              <JobStatus 
                job={activeJob} 
                onStatusUpdate={updateJob}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <JobHistory jobs={jobs} />
        </TabsContent>
      </Tabs>

      {/* Features Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-8">✨ Why Choose Our Generator?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold">AI-Powered</h3>
            <p className="text-sm text-gray-600">
              Advanced AI understands Minecraft aesthetics and creates authentic blocky adventures
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold">Fast Generation</h3>
            <p className="text-sm text-gray-600">
              Get your custom Minecraft videos in seconds, not hours
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold">Customizable</h3>
            <p className="text-sm text-gray-600">
              Control duration, frame rate, resolution, and style to match your vision
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {jobs.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{jobs.length}</div>
              <div className="text-sm text-emerald-700">Total Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter(j => j.status === 'processing').length}
              </div>
              <div className="text-sm text-blue-700">Processing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {jobs.filter(j => j.status === 'pending').length}
              </div>
              <div className="text-sm text-orange-700">Pending</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}