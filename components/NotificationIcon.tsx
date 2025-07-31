import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface NotificationIconProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  color?: string;
}

export default function NotificationIcon({ 
  onPress, 
  style, 
  iconSize = 24, 
  color = 'white' 
}: NotificationIconProps) {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error fetching unread count:', error);
      } else {
        setUnreadCount(count || 0);
      }
    };
    
    fetchUnreadCount();
    
    // Subscribe to new notifications
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        () => {
          // Increment count on new notification
          setUnreadCount(prev => prev + 1);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}` 
        },
        (payload) => {
          if (payload.new.is_read && !payload.old.is_read) {
            // Decrement count when a notification is read
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        { 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          alignItems: 'center', 
          justifyContent: 'center' 
        },
        style
      ]}
    >
      <Ionicons name="notifications" size={iconSize} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
