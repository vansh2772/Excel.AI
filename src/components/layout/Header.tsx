import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
// import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { BarChart3, Database, LogOut, User, Shield, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  // const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#2C3E50] to-[#34495E] dark:from-[#1C1F2B] dark:to-[#2C2F3A] border-b border-gray-700 z-50 shadow-md">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Excel.AI Platform
              </h1>
              <p className="text-sm text-gray-300 dark:text-gray-400">Intelligent data visualization & AI insights</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-400">
              <Database className="w-4 h-4" />
              <span>AI Analytics</span>
            </div>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-white/20 dark:border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full overflow-hidden border border-blue-400/30">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-purple-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
              >
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