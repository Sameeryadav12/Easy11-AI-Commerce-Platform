import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
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

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', { email, password, name });
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

  async getMe() {
    try {
      const response = await api.get('/auth/me');
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

