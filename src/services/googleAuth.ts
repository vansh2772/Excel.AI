interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

class GoogleAuthService {
  private clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Auth can only be initialized in browser'));
        return;
      }

      if (!this.isConfigured()) {
        reject(new Error('Google Client ID not configured. Please check your .env file and ensure VITE_GOOGLE_CLIENT_ID is set with a valid Client ID from Google Cloud Console.'));
        return;
      }

      // Check if Google script is already loaded
      if (window.google) {
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          resolve();
        } else {
          reject(new Error('Failed to load Google Identity Services'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    });
  }

  async signInWithGoogle(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      if (!this.isConfigured()) {
        reject(new Error('Google authentication is not properly configured. Please set up your Google OAuth Client ID in the .env file.'));
        return;
      }

      try {
        // Configure the callback for this specific sign-in attempt
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response: GoogleAuthResponse) => {
            this.parseJwtToken(response.credential)
              .then(resolve)
              .catch((error) => {
                console.error('JWT parsing error:', error);
                reject(new Error('Failed to process Google authentication response'));
              });
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true, // Opt-in to FedCM for future compatibility
          // Add error handling for configuration issues
          error_callback: (error: any) => {
            console.error('Google Auth initialization error:', error);
            reject(new Error('Google authentication configuration error. Please verify your Client ID and authorized JavaScript origins in Google Cloud Console.'));
          }
        });

        // Show the One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            // More specific error message for common configuration issues
            reject(new Error('Google authentication is not available. This is usually caused by:\n\n1. Invalid or missing Client ID\n2. Missing authorized JavaScript origins in Google Cloud Console\n3. Browser blocking third-party cookies\n\nPlease check your Google Cloud Console configuration.'));
          } else if (notification.isSkippedMoment()) {
            reject(new Error('Google authentication was cancelled. Please try again.'));
          } else if (notification.isDismissedMoment()) {
            reject(new Error('Google authentication was dismissed. Please try again.'));
          }
        });
      } catch (error) {
        console.error('Error during Google sign-in setup:', error);
        reject(new Error('Failed to initialize Google authentication. Please check your configuration.'));
      }
    });
  }

  private async parseJwtToken(token: string): Promise<GoogleUser> {
    try {
      // Decode JWT token (simple base64 decode for the payload)
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid JWT token format');
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      // Validate required fields
      if (!payload.sub || !payload.email || !payload.name) {
        throw new Error('Missing required user information in Google response');
      }
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    } catch (error) {
      console.error('JWT parsing error:', error);
      throw new Error('Failed to parse Google authentication response');
    }
  }

  // Method to check if Google Auth is properly configured
  isConfigured(): boolean {
    return !!(this.clientId && 
             this.clientId !== 'your_google_client_id_here' && 
             this.clientId.trim() !== '' &&
             this.clientId.includes('.googleusercontent.com'));
  }

  // Method to get configuration instructions
  getConfigurationInstructions(): string {
    return `To configure Google Authentication:

1. Go to Google Cloud Console (console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API (or Google Identity API)
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Choose "Web application"
6. Add these Authorized JavaScript origins:
   - http://localhost:5173
   - https://localhost:5173
   - http://localhost:5174
   - https://localhost:5174
   - Your production domain (when deploying)
7. Copy the Client ID (should end with .googleusercontent.com)
8. Create a .env file in your project root (copy from .env.example)
9. Add: VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
10. Restart your development server

Current status: ${this.isConfigured() ? 'Configured' : 'Not configured'}`;
  }

  // Method to get detailed error information
  getConfigurationStatus(): { configured: boolean; clientId: string | null; message: string } {
    const configured = this.isConfigured();
    return {
      configured,
      clientId: this.clientId || null,
      message: configured 
        ? 'Google authentication is properly configured'
        : 'Google authentication requires configuration. Please set VITE_GOOGLE_CLIENT_ID in your .env file.'
    };
  }
}

// Extend window interface for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const googleAuthService = new GoogleAuthService();
export type { GoogleUser };