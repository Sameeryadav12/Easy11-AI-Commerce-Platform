/**
 * Notifications Page
 * Sprint 3: Notification center with preferences
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, Settings, Package, Heart, AlertCircle, Star } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import dashboardAPI from '../../services/dashboardAPI';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { notifications, unreadCount, preferences, setNotifications, setPreferences, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notifData, prefData] = await Promise.all([
        dashboardAPI.getNotifications(),
        dashboardAPI.getNotificationPreferences(),
      ]);
      setNotifications(notifData.notifications);
      setPreferences(prefData);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await dashboardAPI.markNotificationAsRead(id);
      markAsRead(id);
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast.success('Notification deleted');
  };

  const handleUpdatePreference = async (type: string, channel: 'email' | 'sms' | 'push', value: boolean) => {
    try {
      const pref = preferences.find((p) => p.type === type);
      if (!pref) return;

      const updatedChannels = { ...pref.channels, [channel]: value };
      await dashboardAPI.updateNotificationPreferences(type, updatedChannels);
      
      // Update in store
      const updatedPrefs = preferences.map((p) =>
        p.type === type ? { ...p, channels: updatedChannels } : p
      );
      setPreferences(updatedPrefs);
      
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return Package;
      case 'wishlist': return Heart;
      case 'security': return AlertCircle;
      case 'rewards': return Star;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Stay updated with your orders, wishlist, and account activity
            </p>
          </div>

          {unreadCount > 0 && activeTab === 'notifications' && (
            <Button onClick={handleMarkAllAsRead} variant="secondary" className="flex items-center gap-2">
              <CheckCheck className="w-5 h-5" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'preferences'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            Preferences
          </button>
        </div>

        {/* Notifications List */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all ${
                      !notification.read_at ? 'border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'order' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          notification.type === 'wishlist' ? 'bg-pink-100 dark:bg-pink-900/30' :
                          notification.type === 'security' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            notification.type === 'order' ? 'text-blue-500' :
                            notification.type === 'wishlist' ? 'text-pink-500' :
                            notification.type === 'security' ? 'text-red-500' :
                            'text-purple-500'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {notification.body}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {!notification.read_at && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {preferences.map((pref) => (
                <div key={pref.type} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="mb-4">
                    <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-1">
                      {pref.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pref.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <label className={`flex items-center gap-2 ${!pref.can_disable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={pref.channels.email}
                        onChange={(e) => handleUpdatePreference(pref.type, 'email', e.target.checked)}
                        disabled={!pref.can_disable}
                        className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                    </label>

                    <label className={`flex items-center gap-2 ${!pref.can_disable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={pref.channels.sms}
                        onChange={(e) => handleUpdatePreference(pref.type, 'sms', e.target.checked)}
                        disabled={!pref.can_disable}
                        className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">SMS</span>
                    </label>

                    <label className={`flex items-center gap-2 ${!pref.can_disable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={pref.channels.push}
                        onChange={(e) => handleUpdatePreference(pref.type, 'push', e.target.checked)}
                        disabled={!pref.can_disable}
                        className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Push</span>
                    </label>
                  </div>

                  {!pref.can_disable && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      ⚠️ Security notifications cannot be disabled
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

