import React, { useState } from 'react';
import { ChatBot } from './ChatBot';
import { DataContext } from '../../services/aiService';
import { Bot, Sparkles } from 'lucide-react';

interface ChatBotToggleProps {
  dataContext?: DataContext;
  onDataUploaded?: (dataContext: DataContext) => void;
}

export const ChatBotToggle: React.FC<ChatBotToggleProps> = ({ dataContext, onDataUploaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={handleToggle}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center relative border border-white/10"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
          <Bot className="w-8 h-8 text-white relative z-10" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-indigo-300 animate-pulse" />
        </button>
        
        <div className="absolute bottom-20 right-0 bg-slate-900 border border-indigo-500/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-2xl">
          Excel.AI Assistant
        </div>
      </div>
    );
  }

  return (
    <ChatBot
      dataContext={dataContext}
      isMinimized={isMinimized}
      onToggleMinimize={handleToggle}
      onClose={handleClose}
      onDataUploaded={onDataUploaded}
    />
  );
};