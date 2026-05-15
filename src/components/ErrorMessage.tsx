import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="glass border border-rose-500/20 rounded-2xl p-8 text-center max-w-md shadow-2xl shadow-rose-950/20">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-slate-400 mb-8 leading-relaxed">{message}</p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 mx-auto border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
      
      <p className="mt-8 text-xs text-slate-600 uppercase tracking-widest font-bold">
        Error Diagnostics Platform
      </p>
    </div>
  );
};

export default ErrorMessage;