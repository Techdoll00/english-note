
import React from 'react';
import { TabType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'Quick', label: 'Quick' },
    { id: 'IELTS', label: 'IELTS' },
    { id: 'Business', label: 'Business' },
    { id: 'Archive', label: 'Archive' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">
      <main className="flex-1 overflow-y-auto px-8 pt-16 pb-32 scroll-smooth">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-md border-t border-neutral-100/50 flex justify-around items-center px-4 py-8 pb-10 z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all font-hand ${
              activeTab === tab.id ? 'text-neutral-900 translate-y-[-2px]' : 'text-neutral-300 hover:text-neutral-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="h-[2px] w-4 bg-neutral-900 mx-auto mt-1 rounded-full animate-in fade-in" />}
          </button>
        ))}
      </nav>
    </div>
  );
};
