'use client';

import { useState } from 'react';
import { MovieData } from '@/types/movie';

interface MovieFormProps {
  onSubmit: (data: MovieData) => void;
  onError: (error: string) => void;
  onStartGeneration: () => void; // New prop to signal starting a new generation
}

export default function MovieForm({ onSubmit, onError, onStartGeneration }: MovieFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Signal that we're starting a new generation
    onStartGeneration();
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate movie concept');
      }

      const data = await response.json();
      onSubmit(data);
      setPrompt('');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your 80s movie vibe..."
            rows={4}
            disabled={isLoading}
            className="w-full h-32 p-4 text-lg bg-black border-2 border-primary rounded-lg 
                     font-orbitron text-foreground placeholder:text-gray-500 focus:ring-2 
                     focus:ring-accent focus:border-transparent outline-none"
          />
        </div>
        <div className="button-container">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`retro-button min-w-[200px] relative ${isLoading ? 'animate-pulse' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-pulse">CANONIZING</span>
                <div className="tracking-widest animate-pulse">...</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent 
                              animate-scan" />
              </div>
            ) : (
              'CANONIZE ME!'
            )}
          </button>
          <button
            type="button"
            disabled={isLoading || !prompt.trim()}
            className="retro-button retro-button-accent min-w-[200px] relative group"
            onClick={() => {
              setPrompt(prompt + ' GO FULL THUNDERFIST');
              // Signal that we're starting a new generation
              onStartGeneration();
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
          >
            <span className="relative z-10">GO FULL THUNDERFIST!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </form>
    </div>
  );
}
