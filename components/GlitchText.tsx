
import React from 'react';

interface GlitchTextProps {
  text: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text }) => {
  return (
    <>
      <div className="glitch-container" data-text={text}>
        {text}
      </div>
      <style>{`
        .glitch-container {
          position: relative;
          font-size: 1.5rem; /* 24px */
          font-weight: bold;
          color: #00f6ff;
          text-shadow: 0 0 5px #00f6ff, 0 0 10px #00f6ff;
          animation: glitch-scan 5s linear infinite;
          background: #000; /* Match parent background to hide text behind clipping */
        }
        .glitch-container::before,
        .glitch-container::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000; /* Match parent background */
          overflow: hidden;
        }
        .glitch-container::before {
          left: 2px;
          text-shadow: -2px 0 #ff00ff;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-container::after {
          left: -2px;
          text-shadow: -2px 0 #00f6ff, 2px 2px #ff00ff;
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 33%, 0 33%); }
          25% { clip-path: polygon(0 40%, 100% 40%, 100% 45%, 0 45%); }
          50% { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); }
          75% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
          100% { clip-path: polygon(0 25%, 100% 25%, 100% 35%, 0 35%); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: polygon(0 67%, 100% 67%, 100% 71%, 0 71%); }
          25% { clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%); }
          50% { clip-path: polygon(0 55%, 100% 55%, 100% 60%, 0 60%); }
          75% { clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
          100% { clip-path: polygon(0 85%, 100% 85%, 100% 95%, 0 95%); }
        }
        @keyframes glitch-scan {
          0%, 100% { clip-path: inset(0 0 98% 0); }
          10% { clip-path: inset(50% 0 48% 0); }
          20% { clip-path: inset(98% 0 0 0); }
          30% { clip-path: inset(20% 0 75% 0); }
          40% { clip-path: inset(0 0 98% 0); }
          50% { clip-path: inset(80% 0 5% 0); }
          60% { clip-path: inset(98% 0 0 0); }
          70% { clip-path: inset(40% 0 55% 0); }
          80% { clip-path: inset(0 0 98% 0); }
          90% { clip-path: inset(90% 0 2% 0); }
        }
      `}</style>
    </>
  );
};