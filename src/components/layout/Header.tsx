import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { BarChart3, Database, LogOut, User, Shield, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-indigo-500/20 shadow-lg shadow-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/40">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Excel.AI Platform</h1>
              <p className="text-xs text-slate-400">Intelligent data visualization & AI insights</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>AI Analytics</span>
              <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
            </div>

            <div className="flex items-center space-x-3 pl-4 border-l border-indigo-500/20">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20 bg-indigo-500/10">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : user?.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-violet-400" />
                  ) : (
                    <User className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-indigo-400 capitalize font-medium">{user?.role}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};