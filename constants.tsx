
import React from 'react';

export const MinimalMark: React.FC<{ active?: boolean; size?: number }> = ({ active, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="transition-transform duration-500">
    <path 
      d="M10 15 Q 12 5, 18 12 Q 22 5, 28 15 Q 35 25, 20 35 Q 5 25, 10 15" 
      stroke="#1a1a1a" 
      strokeWidth="1.5"
      strokeLinecap="round"
      className={active ? "animate-pulse" : ""}
    />
    <path d="M16 18 L16.5 18.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 18 L24.5 18.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    {active && (
      <path 
        d="M12 28 Q 20 32, 28 28" 
        stroke="#1a1a1a" 
        strokeWidth="1" 
        strokeLinecap="round" 
        className="animate-bounce"
      />
    )}
  </svg>
);

export const NotebookAccents: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1] opacity-30">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M5 0 V 100" stroke="#f06292" strokeWidth="0.1" strokeDasharray="1,1" />
      <path d="M7 0 V 100" stroke="#f06292" strokeWidth="0.1" strokeDasharray="1,1" />
    </svg>
  </div>
);
