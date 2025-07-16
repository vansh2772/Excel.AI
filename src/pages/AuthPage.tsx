import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { BarChart3, TrendingUp, PieChart, LineChart, Sparkles, Zap, Brain, Cpu } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-black via-gray-900 to-blue-950 dark:from-black dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden" aria-label="Authentication Page Background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-radial from-blue-800/20 via-purple-800/10 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-700/30 to-purple-700/20 rounded-full blur-2xl animate-glow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl animate-pulse">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Excel.AI Platform
              </h1>
              <p className="text-gray-300 dark:text-gray-400">Transform your data with AI intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              AI-Powered Analytics for Your Excel Data
            </h2>
            <p className="text-lg text-gray-300 dark:text-gray-400 leading-relaxed">
              Upload your Excel and CSV files to create stunning visualizations, 
              get intelligent insights, and make data-driven decisions with our advanced AI assistant.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: 'AI Assistant', desc: 'Chat with your data', color: 'from-blue-500 to-cyan-500' },
              { icon: Brain, title: 'Smart Charts', desc: 'AI-recommended visuals', color: 'from-purple-500 to-pink-500' },
              { icon: Zap, title: 'Real-time Analysis', desc: 'Instant data processing', color: 'from-green-500 to-emerald-500' },
              { icon: Cpu, title: 'Export Options', desc: 'PNG, PDF downloads', color: 'from-orange-500 to-red-500' }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300`}
                />
                <div className="relative flex items-start space-x-3 p-4 bg-white/10 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300 group-hover:scale-105">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-300 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Highlight */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-lg p-4 backdrop-blur-sm border border-blue-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
                <span className="font-semibold text-white">Excel.AI Assistant</span>
              </div>
              <p className="text-sm text-blue-100">
                Upload files directly in chat and get instant AI-powered insights and recommendations!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Remove the following style block */}
      {/*
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      */}
    </div>
  );
};