import api from './api';
import { AuthResponse } from '../types';

// Authentication service with proper function definitions
const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      if (!api || typeof api.post !== 'function') {
        throw new Error('API client not initialized');
      }
      
      const response = await api.post('/auth/login', { email, password });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error: any) {
      // Re-throw with more context
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
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      if (!api || typeof api.post !== 'function') {
        throw new Error('API client not initialized');
      }
      
      const response = await api.post('/auth/register', { email, password, name });
      
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
  },

  getMe: async () => {
    try {
      if (!api || typeof api.get !== 'function') {
        throw new Error('API client not initialized');
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
  },
};

// Verify authService is properly structured
if (typeof authService.login !== 'function') {
  console.error('authService.login is not a function!', authService);
}

// Export both named and default
export { authService };
export default authService;
