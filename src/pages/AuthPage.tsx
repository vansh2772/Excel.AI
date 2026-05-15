import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { BarChart3, Sparkles, Zap, Brain, Cpu } from 'lucide-react';

const PARTICLE_COLORS = [
  'bg-indigo-400', 'bg-violet-400', 'bg-cyan-400', 'bg-pink-400',
  'bg-purple-400', 'bg-blue-400', 'bg-fuchsia-400', 'bg-sky-400'
];

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen font-sans bg-theme-dark flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-radial from-indigo-800/20 via-violet-900/10 to-transparent rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-glow" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        aria-hidden="true"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${PARTICLE_COLORS[i % PARTICLE_COLORS.length]} rounded-full animate-float opacity-70`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              boxShadow: '0 0 6px currentColor',
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/40">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Excel.AI Platform</h1>
              <p className="text-slate-400">Transform your data with AI intelligence</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              AI-Powered Analytics<br />
              <span className="gradient-text">for Your Excel Data</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Upload your Excel and CSV files to create stunning visualizations,
              get intelligent insights, and make data-driven decisions with our advanced AI assistant.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: 'AI Assistant', desc: 'Chat with your data', color: 'from-indigo-500 to-violet-500' },
              { icon: Brain, title: 'Smart Charts', desc: 'AI-recommended visuals', color: 'from-violet-500 to-purple-500' },
              { icon: Zap, title: 'Real-time Analysis', desc: 'Instant data processing', color: 'from-cyan-500 to-blue-500' },
              { icon: Cpu, title: 'Export Options', desc: 'PNG, PDF downloads', color: 'from-pink-500 to-rose-500' },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-sm`} />
                <div className="relative flex items-start space-x-3 p-4 glass rounded-xl hover:border-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Highlight */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative glass rounded-xl p-4 border-indigo-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="font-semibold text-white">Excel.AI Assistant</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">LIVE</span>
              </div>
              <p className="text-sm text-slate-400">
                Upload files directly in chat and get instant AI-powered insights and recommendations!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {isLogin
              ? <LoginForm onToggleMode={() => setIsLogin(false)} />
              : <RegisterForm onToggleMode={() => setIsLogin(true)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};