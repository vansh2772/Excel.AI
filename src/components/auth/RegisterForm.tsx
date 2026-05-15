import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { GoogleAuthButton } from './GoogleAuthButton';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const inputClass = 'w-full pl-10 pr-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-colors text-white placeholder-slate-500 outline-none';
const labelClass = 'block text-sm font-medium text-slate-300 mb-1';

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    try {
      await register(formData.email, formData.password, formData.name);
      toast.success('Account created! Welcome to Excel.AI 🎉');
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === 'auth/email-already-in-use') {
        toast.error('Email already registered. Please sign in.');
      } else if (code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-indigo-900/40 font-sans">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
        <p className="text-slate-400">Join the Excel.AI analytics platform</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <GoogleAuthButton mode="register" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-indigo-500/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-theme-card px-3 text-slate-500">Or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input id="name" name="name" type="text" value={formData.name}
                onChange={handleChange} className={inputClass} placeholder="Your full name" required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input id="reg-email" name="email" type="email" value={formData.email}
                onChange={handleChange} className={inputClass} placeholder="Enter your email" required />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className={labelClass}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                className={`${inputClass} pr-12`} placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input id="confirmPassword" name="confirmPassword" type="password"
                value={formData.confirmPassword} onChange={handleChange}
                className={inputClass} placeholder="Re-enter your password" required />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
            {loading ? <><LoadingSpinner size="sm" /><span className="ml-2">Creating account...</span></> : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <button onClick={onToggleMode} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};