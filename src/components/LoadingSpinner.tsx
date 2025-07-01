import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="text-white/70">Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;