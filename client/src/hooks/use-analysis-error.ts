import { useState } from 'react';

export function useAnalysisError() {
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = () => {
    setAnalysisError(null);
  };

  const setError = (error: string) => {
    setAnalysisError(error);
  };

  const incrementRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const resetRetry = () => {
    setRetryCount(0);
  };

  const handleRetry = (retryFn: () => void) => {
    incrementRetry();
    clearError();
    retryFn();
  };

  return {
    analysisError,
    retryCount,
    clearError,
    setError,
    incrementRetry,
    resetRetry,
    handleRetry,
  };
}
