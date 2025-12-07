/**
 * Notifications Store
 * Sprint 3: Customer Dashboard - Notification Management
 */

import { create } from 'zustand';
import type { Notification, NotificationPreference } from '../types/dashboard';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setPreferences: (preferences: NotificationPreference[]) => void;
  updatePreference: (type: string, channels: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  preferences: [],
  isLoading: false,
  error: null,

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.read_at).length;
    set({ notifications, unreadCount: unread });
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read_at ? state.unreadCount : state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        !n.read_at ? { ...n, read_at: new Date().toISOString() } : n
      ),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && !notification.read_at;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  setPreferences: (preferences) => set({ preferences }),

  updatePreference: (type, channels) =>
    set((state) => ({
      preferences: state.preferences.map((pref) =>
        pref.type === type ? { ...pref, channels } : pref
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      notifications: [],
      unreadCount: 0,
      preferences: [],
      isLoading: false,
      error: null,
    }),
}));

