import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="w-full fixed bottom-0 left-0 z-40 glass border-t border-indigo-500/20">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
      <span className="text-xs text-slate-600 select-none">&nbsp;</span>
      <div className="flex items-center space-x-3">
        <a href="https://github.com/vansh2772/Excel.AI" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors" title="GitHub">
          <Github className="w-4 h-4" />
        </a>
        <a href="https://www.linkedin.com/in/vansh-khandelwal-122205324/" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors" title="LinkedIn">
          <Linkedin className="w-4 h-4" />
        </a>
        <a href="https://excelaivansh.netlify.app" target="_blank" rel="noopener noreferrer"
          className="text-slate-500 hover:text-indigo-400 transition-colors" title="Live Site">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;