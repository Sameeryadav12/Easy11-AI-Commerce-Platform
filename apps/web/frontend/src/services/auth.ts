import api from './api';
import { AuthResponse } from '../types';

/**
 * Authentication Service
 * Direct function implementations to ensure they're always available
 */

// #region agent log
fetch('/api/v1/__debug/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'B',
    location: 'src/services/auth.ts:module',
    message: 'auth module loaded',
    data: {
      importMetaUrl: typeof import.meta !== 'undefined' ? (import.meta as any).url : 'no-import-meta',
      typeofApi: typeof api,
      typeofApiPost: typeof (api as any)?.post,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

// Login function - Direct implementation
export async function login(email: string, password: string): Promise<AuthResponse> {
  console.log('[auth.login] Called with:', { email, password: '***' });
  
  try {
    if (!api) {
      console.error('[auth.login] API client is null');
      throw new Error('API client not initialized');
    }
    
    if (typeof api.post !== 'function') {
      console.error('[auth.login] api.post is not a function:', typeof api.post);
      throw new Error('API client post method not available');
    }
    
    console.log('[auth.login] Making API call to /auth/login');
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
        location: 'src/services/auth.ts:login',
        message: 'calling api.post /auth/login',
        data: { emailPresent: !!email, passwordLength: typeof password === 'string' ? password.length : -1 },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const response = await api.post('/auth/login', { email, password });
    
    console.log('[auth.login] API response received:', { 
      status: response.status,
      hasData: !!response.data 
    });
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
        location: 'src/services/auth.ts:login',
        message: 'received api response /auth/login',
        data: { status: (response as any)?.status, hasData: !!(response as any)?.data },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    
    if (!response || !response.data) {
      console.error('[auth.login] Invalid response:', response);
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error: any) {
    console.error('[auth.login] Error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw error;
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Unable to reach server');
    } else {
      // Something else happened
      throw new Error(error.message || 'Login failed');
    }
  }
}

// Register function - Direct implementation
export async function register(
  email: string,
  password: string,
  name: string,
  termsAcceptedAt?: string
): Promise<AuthResponse> {
  try {
    if (!api) {
      throw new Error('API client not initialized');
    }
    if (typeof api.post !== 'function') {
      throw new Error('API client post method not available');
    }
    const body: { email: string; password: string; name: string; termsAcceptedAt?: string } = {
      email,
      password,
      name,
    };
    if (termsAcceptedAt) body.termsAcceptedAt = termsAcceptedAt;
    const response = await api.post('/auth/register', body);
    
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error;
    } else if (error.request) {
      throw new Error('Network error: Unable to reach server');
    } else {
      throw new Error(error.message || 'Registration failed');
    }
  }
}

// Get current user function
export async function getMe() {
  try {
    if (!api) {
      throw new Error('API client not initialized');
    }
    
    if (typeof api.get !== 'function') {
      throw new Error('API client get method not available');
    }
    
    const response = await api.get('/auth/me');
    
    if (!response || !response.data || !response.data.user) {
      throw new Error('Invalid response from server');
    }
    
    return response.data.user;
  } catch (error: any) {
    if (error.response) {
      throw error;
    } else if (error.request) {
      throw new Error('Network error: Unable to reach server');
    } else {
      throw new Error(error.message || 'Failed to get user info');
    }
  }
}

// Create service object for backward compatibility
const authService = {
  login,
  register,
  getMe,
};

// Verify at module load
console.log('[authService] Module loaded:', {
  'typeof login': typeof login,
  'typeof register': typeof register,
  'typeof getMe': typeof getMe,
  'typeof authService': typeof authService,
  'typeof authService.login': typeof authService.login,
  'authService object': authService,
});

// Export everything
export { authService };
export default authService;
