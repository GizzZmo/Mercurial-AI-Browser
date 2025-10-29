
import React, { useCallback, useEffect, useState } from 'react';
import { analyzeUrlContent, getPageTextContent } from '../services/geminiService';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { GroundingChunk } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  urlToAnalyze: string;
  analysis: string | null;
  setAnalysis: (analysis: string | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  sources: GroundingChunk[];
  setSources: (sources: GroundingChunk[]) => void;
}

const LOADING_MESSAGES = [
  'ACCESSING GRID...',
  'DECRYPTING SIGNALS...',
  'INTERFACING WITH CORE...',
  'RENDERING NEURAL FEED...',
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
    isOpen, onClose, urlToAnalyze, analysis, setAnalysis, isAnalyzing, setIsAnalyzing, sources, setSources
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isFetchingText, setIsFetchingText] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');

  useEffect(() => {
    let interval: number | undefined;
    if (isAnalyzing) {
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 750);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setSources([]);
    setIsError(false);
    const result = await analyzeUrlContent(urlToAnalyze, customInstruction);

    const hasError = result.summary.startsWith('Failed') || result.summary.startsWith('Error:');
    setIsError(hasError);

    setAnalysis(result.summary);
    setSources(result.sources);
    setIsAnalyzing(false);
  }, [urlToAnalyze, customInstruction, setIsAnalyzing, setAnalysis, setSources]);
  
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to the parent div
    if (analysis) {
      navigator.clipboard.writeText(analysis).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    }
  }, [analysis]);
  
  const handleFetchPageText = useCallback(async () => {
    setIsFetchingText(true);
    setAnalysis(null);
    setSources([]);
    setIsError(false);
    
    const result = await getPageTextContent(urlToAnalyze, customInstruction);

    const hasError = result.text.startsWith('Failed') || result.text.startsWith('Error:');
    setIsError(hasError);
    setAnalysis(result.text);
    
    setIsFetchingText(false);
  }, [urlToAnalyze, customInstruction, setAnalysis, setSources, setIsError]);

  useEffect(() => {
    // Clear analysis when url changes
    setAnalysis(null);
    setSources([]);
    setIsError(false);
    setCustomInstruction('');
  }, [urlToAnalyze, setAnalysis, setSources]);


  return (
    <aside className={`absolute top-0 right-0 h-full bg-black/80 backdrop-blur-md border-l-2 border-fuchsia-500/70 shadow-[-10px_0_30px_-5px_rgba(255,0,255,0.4)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full md:w-1/3 lg:w-1/4 z-20 flex flex-col`}>
      <div className="flex justify-between items-center p-4 border-b-2 border-fuchsia-500/50">
        <h2 className="text-xl font-bold text-fuchsia-400">AI CORE</h2>
        <button onClick={onClose} className="text-fuchsia-400 hover:text-white transition-colors">
          <Icon path={ICONS.CLOSE} className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <p className="text-xs text-cyan-400/70 mb-2">TARGET: <span className="text-white break-all">{urlToAnalyze}</span></p>
        
        <div className="mb-4">
            <label htmlFor="custom-instruction" className="block text-sm font-bold tracking-widest text-cyan-300 mb-2">
              // CUSTOM_INSTRUCTION //
            </label>
            <textarea
              id="custom-instruction"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Optional: 'extract all headlines', 'summarize the comments', 'list all product prices'..."
              rows={3}
              className="w-full bg-gray-900/50 text-cyan-300 border-2 border-fuchsia-500/50 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:shadow-[0_0_15px_rgba(255,0,255,0.5)] p-2 transition-all duration-300 placeholder:text-cyan-700/80 text-sm"
            />
        </div>

        <div className="space-y-2 mb-4">
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || isFetchingText}
            className="w-full px-4 py-2 flex items-center justify-center bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 enabled:hover:bg-fuchsia-500/20 enabled:hover:text-fuchsia-200 enabled:hover:shadow-[0_0_10px_rgba(255,0,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          >
            {isAnalyzing ? (
              <>
                <Icon path={ICONS.LOADING} className="w-5 h-5 mr-3 animate-spin" />
                <span className="tracking-widest">{LOADING_MESSAGES[loadingStep]}</span>
              </>
            ) : (
               <>
                <Icon path={ICONS.AI_SPARK} className="w-5 h-5 mr-2" />
                INITIATE ANALYSIS
              </>
            )}
          </button>
          <button 
            onClick={handleFetchPageText} 
            disabled={isAnalyzing || isFetchingText}
            className="w-full px-4 py-2 flex items-center justify-center bg-transparent border-2 border-cyan-500 text-cyan-400 enabled:hover:bg-cyan-500/20 enabled:hover:text-cyan-200 enabled:hover:shadow-[0_0_10px_rgba(0,255,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          >
            {isFetchingText ? (
                <>
                  <Icon path={ICONS.LOADING} className="w-5 h-5 mr-3 animate-spin" />
                  <span className="tracking-widest">FETCHING TEXT...</span>
                </>
            ) : (
              <>
                <Icon path={ICONS.PAGE_TEXT} className="w-5 h-5 mr-2" />
                FETCH PAGE TEXT
              </>
            )}
          </button>
        </div>

        {analysis && (
          <div 
            className={`mt-4 p-4 border transition-all duration-300 ${isError ? 'border-red-500/50 bg-red-900/20' : 'border-cyan-400/30 bg-gray-900/50'}`}
          >
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-bold tracking-widest ${isError ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                    {isError ? '// CORE_ERROR //' : '// CORE_OUTPUT //'}
                </h3>
                {!isError && (
                  <button
                      onClick={handleCopy}
                      disabled={isCopied}
                      aria-label="Copy analysis to clipboard"
                      className="text-cyan-400/70 hover:text-cyan-200 transition-colors flex items-center gap-1.5 text-xs px-2 py-1 border border-transparent hover:border-cyan-400/50 rounded-sm disabled:opacity-50 disabled:cursor-default disabled:hover:border-transparent"
                  >
                      {isCopied ? (
                          'Copied!'
                      ) : (
                          <>
                              <Icon path={ICONS.COPY} className="w-4 h-4" />
                              Copy
                          </>
                      )}
                  </button>
                )}
            </div>
            <p className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${isError ? 'text-red-400/90' : 'text-green-300'}`}>{analysis}</p>
          </div>
        )}
        
        {sources.length > 0 && !isError && (
          <div className="mt-4 p-4 border border-cyan-400/30 bg-gray-900/50">
            <h3 className="text-lg text-cyan-300 mb-2 font-bold tracking-widest">// DATA_SOURCES //</h3>
            <ul className="list-disc list-inside space-y-2">
              <li key="original-url" className="font-mono text-sm text-green-300/80">
                <strong className="text-cyan-400">Original URL: </strong>
                <a 
                  href={urlToAnalyze} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-fuchsia-400 transition-colors break-all"
                >
                  {urlToAnalyze}
                </a>
              </li>
              {sources.map((source, index) => (
                <li key={index} className="font-mono text-sm text-green-300/80">
                  <a 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline hover:text-fuchsia-400 transition-colors break-all"
                  >
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-fuchsia-500/50 text-center text-xs text-fuchsia-500/70">
        Powered by Gemini AI
      </div>
    </aside>
  );
};