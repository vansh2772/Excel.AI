import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { aiService, ChatMessage, DataContext } from '../../services/aiService';
import { processFile } from '../../utils/fileProcessing';
import { calculateStatistics } from '../../utils/dataProcessing';
import { 
  Send, 
  Minimize2, 
  BarChart3,
  X,
  Paperclip,
  Sparkles,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatBotProps {
  dataContext?: DataContext;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  onDataUploaded?: (dataContext: DataContext) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  dataContext, 
  isMinimized = false,
  onToggleMinimize,
  onClose,
  onDataUploaded
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: dataContext 
        ? `Hi! I'm your Excel.AI analyst. I've scanned "${dataContext.fileName}". What insights can I uncover for you today?`
        : "Welcome to Excel.AI! I'm your intelligent data assistant. Upload a file or ask me anything about data analysis and visualization.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [currentDataContext, setCurrentDataContext] = useState<DataContext | undefined>(dataContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setCurrentDataContext(dataContext);
  }, [dataContext]);

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    toast.loading('Analyzing file structure...', { id: 'upload' });

    try {
      const processedData = await processFile(file);
      const analytics = calculateStatistics(processedData);
      
      const newDataContext: DataContext = {
        data: processedData,
        analytics,
        fileName: file.name
      };

      setCurrentDataContext(newDataContext);
      if (onDataUploaded) onDataUploaded(newDataContext);

      const insights = await aiService.generateInsights(newDataContext);
      
      const insightMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ **Analysis Complete!**\n\n${insights}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, insightMessage]);
      toast.success('File analyzed!', { id: 'upload' });
    } catch (err) {
      toast.error('Processing failed', { id: 'upload' });
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Error: ${err instanceof Error ? err.message : 'Invalid file format.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithData(inputMessage, currentDataContext, messages);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      toast.error('AI error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20 hover:scale-110 transition-transform flex items-center justify-center p-0"
        >
          <Bot className="w-8 h-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl glass flex flex-col border border-indigo-500/20 overflow-hidden h-[600px] animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg block leading-none">Excel.AI</span>
            <span className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Intelligent Assistant</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={onToggleMinimize} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-slate-950/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20'
                : 'glass border border-indigo-500/10 text-slate-200 rounded-bl-none'
            }`}>
              {m.role === 'assistant' && (
                <div className="flex items-center space-x-1 mb-1">
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">AI ANALYST</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
              <div className={`text-[10px] mt-2 ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass border border-indigo-500/10 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 glass border-t border-indigo-500/10 space-y-3">
        <div className="flex items-center space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about your data..."
            className="flex-1 bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isLoading || uploadingFile}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || uploadingFile}
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/40 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="text-xs flex items-center space-x-1.5 text-slate-400 hover:text-indigo-400 transition-colors bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>{uploadingFile ? 'Analyzing...' : 'Attach Dataset'}</span>
          </button>
          <span className="text-[10px] text-slate-600 font-medium">ENTER TO SEND</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};