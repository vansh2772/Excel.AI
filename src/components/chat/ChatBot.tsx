import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { aiService, ChatMessage, DataContext } from '../../services/aiService';
import { processFile } from '../../utils/fileProcessing';
import { calculateStatistics } from '../../utils/dataProcessing';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Sparkles,
  BarChart3,
  X,
  Upload,
  FileSpreadsheet,
  Paperclip
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
        ? `Hi! I'm Excel.AI, your intelligent data analyst. I can help you understand your dataset "${dataContext.fileName}" and suggest the best ways to visualize your data. What would you like to know?`
        : "Hi! I'm Excel.AI, your intelligent assistant for Excel and CSV analysis. Upload your files directly here or ask me anything about data analysis, chart recommendations, and insights. How can I help you today?",
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
    if (!file) return;

    setUploadingFile(true);
    
    // Add user message about file upload
    const uploadMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `📁 Uploaded file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, uploadMessage]);

    try {
      // Process the file
      const processedData = await processFile(file);
      const analytics = calculateStatistics(processedData);
      
      const newDataContext: DataContext = {
        data: processedData,
        analytics,
        fileName: file.name
      };

      setCurrentDataContext(newDataContext);
      
      // Notify parent component if callback provided
      if (onDataUploaded) {
        onDataUploaded(newDataContext);
      }

      // Generate automatic insights
      const insights = await aiService.generateInsights(newDataContext);
      
      const insightMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✅ File processed successfully! Here's what I found in your data:\n\n${insights}\n\n💡 You can now ask me specific questions about your data or request chart recommendations!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, insightMessage]);
      toast.success('File uploaded and analyzed successfully!');
      
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry, I couldn't process your file. Please make sure it's a valid Excel (.xlsx, .xls) or CSV file. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithData(inputMessage, currentDataContext, messages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check your API configuration.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!currentDataContext || isLoading) return;

    setIsLoading(true);
    try {
      const insights = await aiService.generateInsights(currentDataContext);
      
      const insightMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔍 **Fresh Insights from your data:**\n\n${insights}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, insightMessage]);
    } catch (error) {
      toast.error('Failed to generate insights');
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

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <BarChart3 className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl bg-white flex flex-col border border-blue-200 overflow-hidden h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg">Excel.AI</span>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleMinimize && (
            <Button onClick={onToggleMinimize} variant="ghost" className="text-white hover:bg-white/20 p-1 rounded-full">
              <Minimize2 className="w-5 h-5" />
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 p-1 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={
              `max-w-[80%] px-4 py-2 rounded-2xl shadow ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none flex items-start space-x-2'
              }`
            }>
              {message.role === 'assistant' && (
                <BarChart3 className="w-5 h-5 text-blue-500 mr-2 mt-1" />
              )}
              <div>
                <div className="text-sm">{message.content}</div>
                <div className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3 flex items-center space-x-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[38px] max-h-[80px] bg-gray-100"
          rows={1}
          disabled={isLoading || uploadingFile}
          style={{ color: 'black' }}
        />
        <Button
          onClick={triggerFileUpload}
          disabled={uploadingFile}
          className="flex items-center space-x-2 bg-blue-800 text-white font-bold border-2 border-blue-900 rounded-full px-4 py-2 shadow-lg hover:bg-blue-900 hover:shadow-xl transition-all duration-200 focus:outline-none disabled:opacity-60 text-base"
        >
          <Paperclip className="w-5 h-5 mr-2" />
          <span>Upload</span>
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading || uploadingFile}
          className="flex items-center justify-center bg-blue-800 text-white font-bold border-2 border-blue-900 rounded-full px-4 py-2 shadow-lg hover:bg-blue-900 hover:shadow-xl transition-all duration-200 focus:outline-none disabled:opacity-60 text-base"
          title='Send'
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};