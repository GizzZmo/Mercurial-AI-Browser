import React, { useState, FormEvent } from 'react';
import { GlitchText } from './GlitchText';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface BrowserControlsProps {
  url: string;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onToggleAIAssistant: () => void;
}

export const BrowserControls: React.FC<BrowserControlsProps> = ({
  url,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  canGoBack,
  canGoForward,
  onToggleAIAssistant,
}) => {
  const [inputValue, setInputValue] = useState(url);

  React.useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNavigate(inputValue);
  };

  return (
    <header className="p-2 border-b-2 border-cyan-400/30 shadow-[0_4px_15px_-5px_rgba(0,255,255,0.3)] bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <GlitchText text="MERCURIAL" />
        </div>
        <div className="flex items-center gap-1">
          <ControlButton onClick={onBack} disabled={!canGoBack} aria-label="Go Back">
            <Icon path={ICONS.BACK} />
          </ControlButton>
          <ControlButton onClick={onForward} disabled={!canGoForward} aria-label="Go Forward">
            <Icon path={ICONS.FORWARD} />
          </ControlButton>
          <ControlButton onClick={onRefresh} aria-label="Refresh Page">
            <Icon path={ICONS.REFRESH} />
          </ControlButton>
        </div>
        <div className="flex-grow">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-900/50 text-cyan-300 border-2 border-fuchsia-500/50 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:shadow-[0_0_15px_rgba(255,0,255,0.5)] px-4 py-1.5 transition-all duration-300 placeholder:text-cyan-700"
              placeholder="Enter URL or search query..."
            />
          </form>
        </div>
        <div className="flex-shrink-0">
          <ControlButton onClick={onToggleAIAssistant} aria-label="Toggle AI Assistant">
            <Icon path={ICONS.AI_SPARK} className="w-5 h-5 mr-2" />
            ANALYZE
          </ControlButton>
        </div>
      </div>
    </header>
  );
};

const ControlButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  'aria-label': string;
}> = ({ onClick, disabled = false, children, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className="px-3 py-1.5 flex items-center justify-center bg-transparent border-2 border-cyan-400/50 text-cyan-400 enabled:hover:bg-cyan-400/20 enabled:hover:text-cyan-200 enabled:hover:shadow-[0_0_10px_rgba(0,255,255,0.4)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);