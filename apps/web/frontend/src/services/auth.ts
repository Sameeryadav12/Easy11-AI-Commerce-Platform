import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};

