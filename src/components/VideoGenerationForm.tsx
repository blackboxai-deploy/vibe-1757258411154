"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerationFormData, VideoJob } from '@/types/video';

interface VideoGenerationFormProps {
  onJobCreated: (job: VideoJob) => void;
  isGenerating: boolean;
}

export default function VideoGenerationForm({ onJobCreated, isGenerating }: VideoGenerationFormProps) {
  const [formData, setFormData] = useState<GenerationFormData>({
    prompt: 'Steve finds diamonds in a cave and escapes from lava, cinematic Minecraft adventure',
    length_seconds: 4,
    fps: 8,
    width: 512,
    height: 512,
  });

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const result = await response.json();
      
      // Create job object for tracking
      const newJob: VideoJob = {
        id: result.job_id,
        prompt: formData.prompt,
        status: 'pending',
        progress: 0,
        created_at: result.created_at,
        parameters: {
          length_seconds: formData.length_seconds,
          fps: formData.fps,
          width: formData.width,
          height: formData.height,
        },
      };

      onJobCreated(newJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateFormData = (field: keyof GenerationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎬 Generate Minecraft Video
        </CardTitle>
        <CardDescription>
          Describe your Minecraft adventure and watch it come to life
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="prompt">Video Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe your Minecraft scene (e.g., Steve explores a cave, finds diamonds, escapes from creepers...)"
              value={formData.prompt}
              onChange={(e) => updateFormData('prompt', e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-sm text-muted-foreground">
              Be descriptive! Mention characters, actions, and atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="length">Duration: {formData.length_seconds} seconds</Label>
              <Slider
                id="length"
                min={2}
                max={10}
                step={1}
                value={[formData.length_seconds]}
                onValueChange={(value) => updateFormData('length_seconds', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">2-10 seconds</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fps">Frame Rate: {formData.fps} FPS</Label>
              <Slider
                id="fps"
                min={4}
                max={12}
                step={2}
                value={[formData.fps]}
                onValueChange={(value) => updateFormData('fps', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">4-12 FPS (higher = smoother)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={formData.width}
                onChange={(e) => updateFormData('width', parseInt(e.target.value))}
                min={256}
                max={1024}
                step={64}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => updateFormData('height', parseInt(e.target.value))}
                min={256}
                max={1024}
                step={64}
              />
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h4 className="font-medium text-emerald-800 mb-2">💡 Tips for better results:</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Include character names (Steve, Alex, Creeper, Enderman)</li>
              <li>• Mention specific locations (cave, village, nether, forest)</li>
              <li>• Add mood descriptors (epic, dramatic, peaceful, adventurous)</li>
              <li>• Describe camera movement (close-up, wide shot, following)</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isGenerating || !formData.prompt.trim()}
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Video...
              </>
            ) : (
              <>🎮 Generate Minecraft Video</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}