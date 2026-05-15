import React from 'react';
import { BarChart3, Github, Linkedin, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="w-full fixed bottom-0 left-0 z-40 glass border-t border-indigo-500/20">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded flex items-center justify-center">
          <BarChart3 className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs text-slate-400">Excel.AI Platform</span>
        <span className="text-xs text-indigo-500/50">•</span>
        <span className="text-xs text-slate-500">Powered by Firebase + Google AI</span>
      </div>
      <div className="flex items-center space-x-3">
        <a href="https://github.com/vansh2772/Excel.AI" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors">
          <Github className="w-4 h-4" />
        </a>
        <a href="https://www.linkedin.com/in/vansh-khandelwal-122205324/" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors">
          <Linkedin className="w-4 h-4" />
        </a>
        <a href="https://excelaivansh.netlify.app" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;