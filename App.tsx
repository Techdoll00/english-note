
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { MinimalMark, NotebookAccents } from './constants';
import { TabType, UpgradeResult, StructuralPattern } from './types';
import { upgradeEnglish } from './services/gemini';
import { saveCard, getCards, deleteCard } from './services/storage';
import { speak } from './services/audio';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Quick');
  const [input, setInput] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [result, setResult] = useState<UpgradeResult | null>(null);
  const [history, setHistory] = useState<UpgradeResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setHistory(getCards());
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev.trim() + ' ' + transcript).trim());
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, [activeTab]);

  const handleUpgrade = async () => {
    if (!input.trim()) return;
    setIsUpgrading(true);
    setResult(null);
    try {
      const res = await upgradeEnglish(input);
      setResult(res);
      saveCard(res);
      setHistory(getCards());
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleListen = async (text: string, id: string) => {
    setPlayingId(id);
    await speak(text);
    setPlayingId(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderCard = (card: UpgradeResult) => (
    <div key={card.id} className="card-paper p-8 mb-12 animate-in slide-in-from-bottom-4 duration-300">
      {card.isOffline && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-neutral-100 px-2 py-0.5 text-[8px] uppercase tracking-widest text-neutral-400 border border-neutral-200 rounded">
          Offline Mode
        </div>
      )}
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold text-neutral-300 tracking-widest uppercase font-hand">
            {new Date(card.timestamp).toLocaleDateString()}
          </span>
          <p className="text-xl mt-1 leading-tight font-hand text-neutral-600">"{card.original}"</p>
        </div>
        <button onClick={() => { deleteCard(card.id); setHistory(getCards()); }} className="text-neutral-200 hover:text-neutral-900 transition-colors p-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1L13 13M1 13L13 1" /></svg>
        </button>
      </div>

      <div className="space-y-12">
        <div className="text-sm text-neutral-500 font-hand italic leading-relaxed border-l border-neutral-200 pl-4 py-1">
          {card.acknowledgedMeaning}
        </div>

        <Section 
          label="Clear English" 
          content={card.clear} 
          onCopy={() => copyToClipboard(card.clear, `${card.id}-clear`)} 
          isCopied={copiedId === `${card.id}-clear`}
          onListen={() => handleListen(card.clear, `${card.id}-clear-audio`)}
          isPlaying={playingId === `${card.id}-clear-audio`}
        />

        {activeTab !== 'IELTS' && (
          <Section 
            label="Business Version" 
            content={card.business} 
            onCopy={() => copyToClipboard(card.business, `${card.id}-biz`)} 
            isCopied={copiedId === `${card.id}-biz`}
            onListen={() => handleListen(card.business, `${card.id}-biz-audio`)}
            isPlaying={playingId === `${card.id}-biz-audio`}
          />
        )}

        {activeTab !== 'Business' && (
          <Section 
            label="IELTS Writing/Speaking" 
            content={card.ielts} 
            onCopy={() => copyToClipboard(card.ielts, `${card.id}-ielts`)} 
            isCopied={copiedId === `${card.id}-ielts`}
            onListen={() => handleListen(card.ielts, `${card.id}-ielts-audio`)}
            isPlaying={playingId === `${card.id}-ielts-audio`}
          />
        )}

        <div className="pt-8 border-t border-dashed border-neutral-200">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 font-hand">Structural Patterns</p>
          <div className="space-y-4">
            {card.patterns.map((p, i) => (
              <PatternNote key={i} pattern={p} />
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#fff9c4]/10 rounded border border-[#fff9c4]/50">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 font-hand">Feynman Challenge</p>
          <p className="text-sm text-neutral-700 leading-relaxed font-hand text-lg italic">"{card.feynmanChallenge}"</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setResult(null); }}>
      <NotebookAccents />
      
      {activeTab !== 'Archive' && (
        <div className="animate-in fade-in duration-700">
          <header className="mb-16 flex items-center justify-between">
            <div>
              <MinimalMark active={isUpgrading || isRecording} />
              <h1 className="text-3xl font-hand mt-2 text-neutral-800">Doodle English</h1>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">v1.0.0</span>
            </div>
          </header>

          <div className="relative mb-16">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Say or type one thought..."}
              className={`w-full h-40 bg-transparent text-xl font-hand focus:outline-none resize-none transition-all placeholder:text-neutral-300 ${isRecording ? 'opacity-40 translate-y-1' : 'opacity-100'}`}
            />
            
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-6">
                 <button 
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-full sketch-border flex items-center justify-center transition-all tap-active ${isRecording ? 'bg-neutral-800 border-neutral-800' : 'bg-white hover:bg-neutral-50'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-white' : 'bg-neutral-800'}`} />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-hand">{isRecording ? 'Stop Recording' : 'Voice Input'}</span>
              </div>

              <button 
                onClick={handleUpgrade} 
                disabled={isUpgrading || !input.trim()} 
                className={`px-6 py-2 sketch-border font-hand text-lg transition-all tap-active bg-white ${isUpgrading || !input.trim() ? 'opacity-30' : 'hover:shadow-md'}`}
              >
                {isUpgrading ? "Upgrading..." : "Next →"}
              </button>
            </div>
          </div>

          {isUpgrading && (
            <div className="space-y-12 animate-pulse mt-12">
              <div className="skeleton h-32 rounded w-full" />
              <div className="skeleton h-48 rounded w-full" />
            </div>
          )}
          
          {result && renderCard(result)}

          {!result && !isUpgrading && (
             <div className="mt-24 text-center opacity-20 py-12">
                <p className="font-hand text-lg italic">"Clear thoughts, clear words."</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'Archive' && (
        <div className="animate-in fade-in duration-500">
          <header className="mb-16">
             <h2 className="text-3xl font-hand">Saved Cards</h2>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">{history.length} items in archive</p>
          </header>
          {history.length === 0 ? (
            <div className="py-24 text-center opacity-20">
               <p className="font-hand text-xl">The archive is empty.</p>
            </div>
          ) : (
            history.map(card => renderCard(card))
          )}
        </div>
      )}
    </Layout>
  );
};

const Section: React.FC<{ 
  label: string; 
  content: string; 
  onCopy: () => void; 
  isCopied: boolean; 
  onListen: () => void;
  isPlaying: boolean;
}> = ({ label, content, onCopy, isCopied, onListen, isPlaying }) => (
  <div className="group">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 font-hand">{label}</span>
      <div className="flex gap-4">
        <button onClick={onListen} className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isPlaying ? 'text-neutral-900' : 'text-neutral-300 hover:text-neutral-600'}`}>
          {isPlaying ? 'Playing' : 'Listen'}
        </button>
        <button onClick={onCopy} className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isCopied ? 'text-neutral-900' : 'text-neutral-300 hover:text-neutral-600'}`}>
          {isCopied ? 'Saved' : 'Copy'}
        </button>
      </div>
    </div>
    <p className="text-lg text-neutral-800 leading-snug">{content}</p>
  </div>
);

const PatternNote: React.FC<{ pattern: StructuralPattern }> = ({ pattern }) => (
  <div className="bg-neutral-50/50 p-4 rounded sketch-border relative bg-grid">
    <div className="flex flex-col gap-1">
      <h5 className="text-[9px] uppercase font-bold text-neutral-400 tracking-widest">{pattern.title}</h5>
      <p className="text-sm font-bold text-neutral-800">{pattern.template}</p>
      <p className="text-[10px] text-neutral-500 italic mt-1">{pattern.note}</p>
    </div>
  </div>
);

export default App;
