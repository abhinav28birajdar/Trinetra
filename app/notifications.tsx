import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

const { width, height } = Dimensions.get('window');

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'message' | 'location' | 'emergency' | 'system';
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  related_data?: any;
}

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications from database
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // First check if the notification table exists
      const { error: tableError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1);
        
      if (tableError && tableError.message.includes('does not exist')) {
        console.log('Notifications table does not exist, creating sample data');
        // Create sample notification for demonstration
        setNotifications([
          {
            id: 'sample-1',
            user_id: user.id,
            title: 'Welcome to Trinatra',
            message: 'Your safety app is now set up and ready to use.',
            type: 'system',
            is_read: false,
            created_at: new Date().toISOString(),
            sender_name: 'Trinatra System'
          }
        ]);
        setIsLoading(false);
        setRefreshing(false);
        return;
      }
      
      // If table exists, fetch notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching notifications:', error);
        // Provide fallback data
        setNotifications([
          {
            id: 'fallback-1',
            user_id: user.id,
            title: 'Welcome to Trinatra',
            message: 'Your safety app is now set up and ready to use.',
            type: 'system',
            is_read: false,
            created_at: new Date().toISOString(),
            sender_name: 'Trinatra System'
          }
        ]);
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching notifications:', err);
      // Fallback to sample data
      setNotifications([
        {
          id: 'error-1',
          user_id: user.id,
          title: 'Welcome to Trinatra',
          message: 'Your safety app is now set up and ready to use.',
          type: 'system',
          is_read: false,
          created_at: new Date().toISOString(),
          sender_name: 'Trinatra System'
        }
      ]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user?.id}` 
        },
        (payload) => {
          // Add the new notification to the list
          setNotifications(current => [payload.new as Notification, ...current]);
        }
      )
      .subscribe();
      
    return () => {
      // Clean up subscription when component unmounts
      subscription.unsubscribe();
    };
  }, [user]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error marking notification as read:', error);
      } else {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true } 
              : notif
          )
        );
      }
    } catch (err) {
      console.error('Unexpected error marking notification:', err);
    }
  };

  // Handle notification press
  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'location' && notification.related_data?.coordinates) {
      router.push({
        pathname: '/(tabs)/live-location',
        params: { 
          lat: notification.related_data.coordinates.latitude,
          lng: notification.related_data.coordinates.longitude,
          sender: notification.sender_name || 'Someone'
        }
      });
    } else if (notification.type === 'message') {
      router.push('/(tabs)/community');
    } else if (notification.type === 'emergency') {
      router.push('/emergency-access');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting notification:', error);
        Alert.alert('Error', 'Failed to delete notification');
      } else {
        // Update local state
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        Alert.alert('Success', 'Notification deleted successfully');
      }
    } catch (err) {
      console.error('Unexpected error deleting notification:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking all notifications as read:', error);
        Alert.alert('Error', 'Failed to mark all notifications as read');
      } else {
        // Update local state
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
        Alert.alert('Success', 'All notifications marked as read');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  // Get type-specific icon and color
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'message':
        return { icon: 'chatbubble', color: '#3B82F6' };
      case 'location':
        return { icon: 'location', color: '#10B981' };
      case 'emergency':
        return { icon: 'warning', color: '#EF4444' };
      default:
        return { icon: 'notifications', color: '#8B5CF6' };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render a notification item
  const renderNotification = ({ item }: { item: Notification }) => {
    const { icon, color } = getNotificationStyle(item.type);
    
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={{
          backgroundColor: item.is_read ? 'white' : '#F3F4F6',
          marginHorizontal: 20,
          marginBottom: 12,
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {/* Icon */}
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: `${color}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16
        }}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        
        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          
          <Text style={{ fontSize: 14, color: '#4B5563', marginTop: 4, marginBottom: 4 }}>
            {item.message}
          </Text>
          
          {!item.is_read && (
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: color,
              position: 'absolute',
              top: 0,
              right: 0
            }} />
          )}
        </View>
        
        {/* Delete button */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Notification",
              "Are you sure you want to delete this notification?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Delete", 
                  style: "destructive",
                  onPress: () => deleteNotification(item.id)
                }
              ]
            );
          }}
          style={{ padding: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <LinearGradient
        colors={['#7C3AED', '#A855F7']}
        style={{
          paddingTop: 60,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            flex: 1,
            textAlign: 'center'
          }}>
            Notifications
          </Text>
          <TouchableOpacity 
            onPress={markAllAsRead}
            style={{ padding: 8 }}
            disabled={!notifications.some(n => !n.is_read)}
          >
            <Ionicons 
              name="checkmark-done" 
              size={24} 
              color={notifications.some(n => !n.is_read) ? "white" : "rgba(255,255,255,0.5)"} 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
          <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
            You don't have any notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications();
              }}
              colors={['#7C3AED']}
              tintColor={'#7C3AED'}
            />
          }
        />
      )}
    </View>
  );
}
