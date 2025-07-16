import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { googleAuthService } from '../../services/googleAuth';
import toast from 'react-hot-toast';

interface GoogleAuthButtonProps {
  mode: 'login' | 'register';
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ mode }) => {
  const { loginWithGoogle, loading } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      // Check if Google Auth is properly configured
      const configStatus = googleAuthService.getConfigurationStatus();
      
      if (!configStatus.configured) {
        const instructions = googleAuthService.getConfigurationInstructions();
        console.error('Google Auth Configuration Required:\n', instructions);
        
        toast.error(
          'Google Authentication is not configured. Please check the console for setup instructions.',
          { duration: 6000 }
        );
        return;
      }

      await loginWithGoogle();
      toast.success(`${mode === 'login' ? 'Login' : 'Registration'} successful!`);
    } catch (error) {
      console.error('Google auth error:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Google authentication failed';
      
      if (error instanceof Error) {
        if (error.message.includes('configuration')) {
          errorMessage = 'Google authentication is not properly configured. Please check your setup.';
        } else if (error.message.includes('cancelled') || error.message.includes('dismissed')) {
          errorMessage = 'Google authentication was cancelled. Please try again.';
        } else if (error.message.includes('not available')) {
          errorMessage = 'Google authentication is not available. Please check your browser settings and configuration.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Network error during Google authentication. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage, { duration: 5000 });
      
      // Log configuration status for debugging
      const configStatus = googleAuthService.getConfigurationStatus();
      console.log('Google Auth Configuration Status:', configStatus);
      
      if (!configStatus.configured) {
        console.log('Setup Instructions:\n', googleAuthService.getConfigurationInstructions());
      }
    }
  };

  // Check configuration status on render
  const configStatus = googleAuthService.getConfigurationStatus();
  
  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center space-x-3 py-3 bg-white/10 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 text-white backdrop-blur-sm transition-all duration-200 font-sans"
        aria-label={mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        onClick={handleGoogleAuth}
        disabled={loading || !configStatus.configured}
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>
              {!configStatus.configured 
                ? 'Google Auth Not Configured' 
                : mode === 'login' 
                  ? 'Sign in with Google' 
                  : 'Sign up with Google'
              }
            </span>
          </>
        )}
      </Button>
      
      {!configStatus.configured && (
        <p className="text-xs text-red-300 mt-2 text-center">
          Please configure Google OAuth in your .env file
        </p>
      )}
    </div>
  );
};