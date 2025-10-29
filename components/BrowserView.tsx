
import React, { useEffect, RefObject } from 'react';

interface BrowserViewProps {
  url: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setCurrentUrl: (url: string) => void;
  iframeRef: RefObject<HTMLIFrameElement>;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ url, isLoading, setIsLoading, setCurrentUrl, iframeRef }) => {

  useEffect(() => {
    const iframe = iframeRef.current;
    const handleLoad = () => {
      setIsLoading(false);
      try {
        const newUrl = iframe?.contentWindow?.location.href;
        // Check for about:blank to avoid updating URL on initial empty load
        if (newUrl && newUrl !== 'about:blank' && newUrl !== url) {
            setCurrentUrl(newUrl);
        }
      } catch (e) {
        // Cross-origin error, can't access location. This is expected.
      }
    };
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [setIsLoading, setCurrentUrl, url, iframeRef]);

  return (
    <div className="flex-grow bg-gray-900 border-4 border-t-0 border-cyan-400/30 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
          <div className="loader"></div>
          <p className="mt-4 text-lg tracking-widest animate-pulse">CONNECTING TO GRID...</p>
        </div>
      )}
      <div className="absolute top-2 left-2 p-3 max-w-sm bg-black/80 backdrop-blur-sm border border-red-500/50 rounded-md shadow-lg pointer-events-none z-10">
        <p className="text-sm text-red-400 font-bold">[ SECURITY PROTOCOL ]</p>
        <p className="text-xs text-red-400/80 mt-1">
          Many sites (e.g., Google, news portals) block direct embedding for security. If a page is blank or shows an error, it's likely due to its 'X-Frame-Options' policy.
        </p>
        <p className="text-xs text-cyan-300/80 mt-2">
          <span className="font-bold">WORKAROUND:</span> Use the <span className="font-bold text-fuchsia-400">ANALYZE</span> button. The AI Core can access the content even when the page view is blocked.
        </p>
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        title="Mercurial Browser View"
        className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-20' : 'opacity-100'}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      />
      <style>{`
        .loader {
          border: 4px solid #f3f3f330;
          border-top: 4px solid #ff00ff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 15px #ff00ff;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
