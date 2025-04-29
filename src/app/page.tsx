'use client';

import { useState } from 'react';
import MovieForm from '@/components/MovieForm';
import MovieOutput from '@/components/MovieOutput';
import VHSLoader from './vhsLoader';
import FailSafeOutput from '@/components/FailSafeOutput';
import { MovieData } from '@/types/movie';

export default function Home() {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (data: MovieData) => {
    setError(null);
    setMovieData(data);
    setIsGenerating(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setMovieData(null);
    setIsGenerating(false);
  };

  const handleStartGeneration = () => {
    // Clear previous movie data when starting a new generation
    setMovieData(null);
    setError(null);
    setIsGenerating(true);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="app-title">
          Canonizer 3000
        </h1>
        
        <MovieForm 
          onSubmit={handleSubmit} 
          onError={handleError} 
          onStartGeneration={handleStartGeneration} 
        />
        
        {error && (
          error.includes('ALL TAPES ARE RENTED') ? (
            <FailSafeOutput />
          ) : (
            <div className="text-red-500 text-center font-orbitron animate-pulse mt-4">
              {error}
            </div>
          )
        )}

        {isGenerating && !movieData && (
          <VHSLoader />
        )}

        {movieData && <MovieOutput data={movieData} />}
      </div>
    </main>
  );
}
