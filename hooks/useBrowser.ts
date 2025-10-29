import { useState, useCallback } from 'react';

export const useBrowser = (initialUrl: string) => {
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentUrl = history[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const navigate = useCallback((url: string) => {
    if (url === currentUrl) return;
    setIsLoading(true);
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex, currentUrl]);
  
  const setCurrentUrl = useCallback((url: string) => {
      const newHistory = [...history];
      newHistory[currentIndex] = url;
      setHistory(newHistory);
  }, [history, currentIndex]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      setIsLoading(true);
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [canGoBack]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      setIsLoading(true);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [canGoForward]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    // Force a re-render of the iframe by slightly changing the key or url
    // For simplicity, we just set loading state and the iframe will re-request its src
    setHistory(prev => [...prev]);
  }, []);

  return {
    currentUrl,
    isLoading,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    refresh,
    setIsLoading,
    setCurrentUrl,
  };
};