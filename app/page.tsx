'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import InputForm, { CoffeeInputData } from './components/InputForm';
import LoadingAnimation from './components/LoadingAnimation';
import ResultDisplay, { AnalysisResult } from './components/ResultDisplay';

type AppState = 'input' | 'loading' | 'result' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalyze = async (inputData: CoffeeInputData) => {
    setAppState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.data);
        setAppState('result');
      } else {
        setErrorMessage(data.error || 'Analysis failed. Please try again.');
        setAppState('error');
        // Return to input after 3 seconds
        setTimeout(() => setAppState('input'), 3000);
      }
    } catch (error) {
      console.error('Error analyzing coffee:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setAppState('error');
      // Return to input after 3 seconds
      setTimeout(() => setAppState('input'), 3000);
    }
  };

  const handleReset = () => {
    setAppState('input');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-background to-cream py-12 px-4">
      <AnimatePresence mode="wait">
        {appState === 'input' && (
          <InputForm key="input" onAnalyze={handleAnalyze} />
        )}
        {appState === 'loading' && (
          <LoadingAnimation key="loading" />
        )}
        {appState === 'error' && (
          <div key="error" className="w-full max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-300 p-8 md:p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-coffee-dark mb-4">Analysis Error</h2>
                <p className="text-coffee-medium mb-4">{errorMessage}</p>
                <p className="text-sm text-slate">Returning to input form...</p>
              </div>
            </div>
          </div>
        )}
        {appState === 'result' && analysisResult && (
          <ResultDisplay key="result" result={analysisResult} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
}
