import { useState, useCallback } from 'react';

export const useAnalysisState = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState(null);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
  }, []);

  const updateProgress = useCallback((progress) => {
    setAnalysisProgress(Math.min(progress, 99));
  }, []);

  const completeAnalysis = useCallback(() => {
    setAnalysisProgress(100);
    setIsAnalyzing(false);
  }, []);

  const setAnalysisError = useCallback((errorMsg) => {
    setError(errorMsg);
    setIsAnalyzing(false);
  }, []);

  const resetState = useCallback(() => {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysisProgress,
    error,
    startAnalysis,
    updateProgress,
    completeAnalysis,
    setAnalysisError,
    resetState,
  };
};
