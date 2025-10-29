import React, { useState, useCallback, useRef } from 'react';
import { BrowserControls } from './components/BrowserControls';
import { BrowserView } from './components/BrowserView';
import { AIAssistant } from './components/AIAssistant';
import { useBrowser } from './hooks/useBrowser';
import type { GroundingChunk } from './types';

const App: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { 
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
  } = useBrowser('https://en.wikipedia.org/wiki/Cyberpunk');

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUrlSubmit = useCallback((url: string) => {
    // Basic URL sanitization
    if (url && !url.match(/^https?:\/\//)) {
      navigate(`https://${url}`);
    } else {
      navigate(url);
    }
  }, [navigate]);
  
  return (
    <div className="flex flex-col h-screen bg-black bg-grid-cyan-500/[0.05]">
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
      <div className="relative z-10 flex flex-col h-full">
        <BrowserControls
          url={currentUrl}
          onNavigate={handleUrlSubmit}
          onBack={goBack}
          onForward={goForward}
          onRefresh={refresh}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onToggleAIAssistant={() => setIsAssistantOpen(prev => !prev)}
        />
        <main className="flex-grow flex relative">
          <BrowserView 
            iframeRef={iframeRef}
            url={currentUrl} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
            setCurrentUrl={setCurrentUrl}
          />
          <AIAssistant 
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            urlToAnalyze={currentUrl}
            analysis={analysis}
            setAnalysis={setAnalysis}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            sources={sources}
            setSources={setSources}
          />
        </main>
      </div>
    </div>
  );
};

export default App;