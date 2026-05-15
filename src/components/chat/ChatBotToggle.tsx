import React, { useState } from 'react';
import { ChatBot } from './ChatBot';
import { DataContext } from '../../services/aiService';
import { BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';

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
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleToggle}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
        >
          <BarChart3 className="w-6 h-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
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