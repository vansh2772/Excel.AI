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

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl font-sans" aria-label="Register Form">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <p className="text-gray-300 dark:text-gray-400">Join our analytics platform</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Login Button */}
        <div className="space-y-3">
          <GoogleAuthButton mode="register" />
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20 dark:border-gray-700/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};