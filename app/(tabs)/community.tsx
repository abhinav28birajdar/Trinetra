import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  is_emergency?: boolean;
  avatar_color?: string;
  phone?: string;
  message_type?: string;
}

interface CommunityMember {
  id: string;
  username: string;
  avatar_color: string;
  phone: string;
  is_online: boolean;
  last_seen: string;
}

export default function CommunityScreen() {
  const { user, profile } = useAuthStore();
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [newMember, setNewMember] = useState({
    username: '',
    phone: '',
    avatar_color: '#8B5CF6'
  });
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const supabaseSubscription = useRef<any>(null);
  
  // Fetch community messages on mount
  useEffect(() => {
    console.log('Community component mounted, initializing data...');
    
    const initializeData = async () => {
      try {
        console.log('Starting to initialize community data...');
        
        // Test Supabase connection first
        try {
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
          if (testError) {
            console.error('Supabase connection test failed:', testError);
            Alert.alert('Connection Issue', 'Unable to connect to the server. Please check your internet connection and try again.');
          } else {
            console.log('Supabase connection is working properly');
          }
        } catch (connErr) {
          console.error('Error testing Supabase connection:', connErr);
        }
        
        await fetchCommunityMessages();
        await fetchCommunityMembers();
        await subscribeToNewMessages();
        console.log('Community data initialization complete');
      } catch (error) {
        console.error('Error during community initialization:', error);
      }
    };
    
    initializeData();
    
    // Set up a periodic refresh timer as a backup in case realtime fails
    const refreshInterval = setInterval(() => {
      console.log('Running periodic message refresh...');
      fetchCommunityMessages();
    }, 30000); // Refresh every 30 seconds
    
    // Cleanup subscription when component unmounts
    return () => {
      console.log('Community component unmounting, cleaning up...');
      clearInterval(refreshInterval);
      if (supabaseSubscription.current) {
        supabase.removeChannel(supabaseSubscription.current);
        console.log('Supabase channel removed');
      }
    };
  }, []);
  
  // Fetch community messages from database
  const fetchCommunityMessages = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to fetch community messages...');
      
      // Fetch messages from the database
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          id,
          user_id,
          message,
          message_type,
          is_emergency,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) {
        console.error('Error fetching community messages:', error);
        Alert.alert('Error', 'Failed to load community messages');
      } else if (data) {
        console.log(`Retrieved ${data.length} messages from database`);
        
        // We need to fetch profile information separately
        const userIds = [...new Set(data.map(msg => msg.user_id))];
        console.log(`Found ${userIds.length} unique users in messages`);
        
        // Create a map of user profiles
        const userProfiles: Record<string, any> = {};
        
        if (userIds.length > 0) {
          console.log('Fetching user profiles...');
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, username, phone, avatar_url')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching user profiles:', profilesError);
          } else if (profilesData) {
            console.log(`Retrieved ${profilesData.length} user profiles`);
            
            // Create a lookup map
            profilesData.forEach(profile => {
              userProfiles[profile.id] = profile;
            });
          }
        }
        
        // Format messages with profile info from the map
        console.log('Formatting messages with profile information...');
        const formattedMessages = data.map(msg => {
          const profile = userProfiles[msg.user_id] || null;
          return {
            id: msg.id,
            user_id: msg.user_id,
            username: profile?.full_name || profile?.username || 'Anonymous',
            message: msg.message,
            timestamp: msg.created_at,
            is_emergency: msg.is_emergency || msg.message_type === 'emergency' || msg.message_type === 'alert',
            avatar_color: getAvatarColor(msg.user_id),
            phone: profile?.phone,
            message_type: msg.message_type
          };
        });
        
        console.log(`Setting ${formattedMessages.length} formatted messages to state`);
        setMessages(formattedMessages);
        
        // Count alerts
        const alerts = data.filter(msg => msg.is_emergency || msg.message_type === 'emergency' || msg.message_type === 'alert');
        setAlertCount(alerts.length);
        console.log(`Found ${alerts.length} emergency/alert messages`);
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    } finally {
      setIsLoading(false);
      console.log('Finished loading community messages');
    }
  };
  
  // Fetch community members from database
  const fetchCommunityMembers = async () => {
    try {
      console.log('Starting to fetch community members...');
      
      // Get recently active users (online in last 30 minutes)
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      console.log('Fetching users active since:', thirtyMinutesAgo.toISOString());
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, phone, last_seen')
        .gt('last_seen', thirtyMinutesAgo.toISOString())
        .order('last_seen', { ascending: false });
        
      if (error) {
        console.error('Error fetching community members:', error);
      } else if (data) {
        console.log(`Retrieved ${data.length} active community members`);
        
        const members = data.map(user => ({
          id: user.id,
          username: user.full_name || user.username || 'User',
          avatar_color: getAvatarColor(user.id),
          phone: user.phone || '',
          is_online: true,
          last_seen: user.last_seen
        }));
        
        console.log('Setting community members to state...');
        setCommunityMembers(members);
        setOnlineCount(members.length);
        console.log(`Online count: ${members.length}`);
      }
    } catch (err) {
      console.error('Error fetching community members:', err);
    }
  };
  
  // Subscribe to new messages in real-time
  const subscribeToNewMessages = async () => {
    try {
      console.log('Setting up realtime subscription for community messages...');
      
      // Test if realtime is available
      const channels = supabase.getChannels();
      console.log('Current Supabase channels:', channels.length);
      
      const channel = supabase
        .channel('community-messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'community_messages' 
          }, 
          async (payload) => {
            console.log('Received new message via subscription:', payload);
            
            // When a new message is created, fetch user details
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name, username, phone')
              .eq('id', payload.new.user_id)
              .single();
              
            if (userError) {
              console.error('Error fetching user data for message:', userError);
            }
            
            console.log('User data for message:', userData);
              
            const newMsg: Message = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              username: userData?.full_name || userData?.username || 'Anonymous',
              message: payload.new.message,
              timestamp: payload.new.created_at,
              is_emergency: payload.new.is_emergency || payload.new.message_type === 'emergency' || payload.new.message_type === 'alert',
              avatar_color: getAvatarColor(payload.new.user_id),
              phone: userData?.phone,
              message_type: payload.new.message_type
            };
            
            console.log('Adding message to state:', newMsg);
            
            // Add the new message to the state
            setMessages(prev => {
              // Check if message already exists in state (to avoid duplicates)
              const messageExists = prev.some(msg => msg.id === newMsg.id);
              if (messageExists) {
                console.log('Message already exists in state, not adding duplicate');
                return prev;
              }
              console.log('Adding new message to state array');
              return [newMsg, ...prev];
            });
            
            // Update alert count if needed
            if (newMsg.is_emergency) {
              setAlertCount(prev => prev + 1);
            }
            
            // Display a notification for important messages if they're not from current user
            if ((newMsg.is_emergency || newMsg.message_type === 'emergency' || newMsg.message_type === 'alert') 
                && newMsg.user_id !== user?.id) {
              Alert.alert(
                'New Emergency Alert',
                `${newMsg.username}: ${newMsg.message}`,
                [{ text: 'OK' }]
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
        
      supabaseSubscription.current = channel;
      
      // Verify channel was registered
      const channelsAfter = supabase.getChannels();
      console.log('Supabase channels after subscription:', channelsAfter.length);
      console.log('Channel state:', channel.state);
    } catch (err) {
      console.error('Error subscribing to new messages:', err);
    }
  };
  
  // Generate consistent avatar colors based on user ID
  const getAvatarColor = (userId: string) => {
    const colors = ['#8B5CF6', '#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#EC4899'];
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return colors[hash % colors.length];
  };

  // Handle pull-to-refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Manual refresh triggered by user');
    try {
      await fetchCommunityMessages();
      await fetchCommunityMembers();
      
      // If we have a subscription, check its status
      if (supabaseSubscription.current) {
        const currentState = supabaseSubscription.current.state;
        console.log('Current subscription state:', currentState);
        
        // If subscription is in a bad state, reconnect
        if (currentState !== 'SUBSCRIBED') {
          console.log('Subscription not in SUBSCRIBED state, reconnecting...');
          await subscribeToNewMessages();
        }
      } else {
        console.log('No subscription found, creating new one');
        await subscribeToNewMessages();
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      console.log('Sending message:', newMessage.trim());
      
      // Update user's last_seen timestamp
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.id);
      
      console.log('Sending message to community_messages table...');
      
      // Save message to database
      const { data, error } = await supabase
        .from('community_messages')
        .insert({
          user_id: user.id,
          message: newMessage.trim(),
          message_type: 'general',
          is_emergency: false
        })
        .select();
        
      if (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
        return;
      }
      
      console.log('Message sent successfully:', data);
      
      // Create notifications for community members (optional feature)
      if (data && data.length > 0) {
        try {
          // Get all community members except the sender
          const { data: communityUsers } = await supabase
            .from('profiles')
            .select('id')
            .neq('id', user.id)
            .eq('receive_community_notifications', true);
            
          if (communityUsers && communityUsers.length > 0) {
            // Create notifications for each user
            const notifications = communityUsers.map(member => ({
              user_id: member.id,
              title: 'New Community Message',
              message: `${profile?.full_name || user.email?.split('@')[0] || 'Someone'}: ${newMessage.trim().substring(0, 100)}${newMessage.trim().length > 100 ? '...' : ''}`,
              type: 'message',
              sender_name: profile?.full_name || user.email?.split('@')[0],
              related_data: { message_id: data[0].id }
            }));
            
            // Insert all notifications
            await supabase.from('notifications').insert(notifications);
          }
        } catch (notifError) {
          console.error('Error creating notifications:', notifError);
          // Don't alert as this is not critical to the user experience
        }
      }
      
      // Add the message directly to the UI instead of waiting for subscription
      if (data && data.length > 0) {
        console.log('Creating message object with returned data');
        const newMsg: Message = {
          id: data[0].id,
          user_id: user.id,
          username: profile?.full_name || user?.email?.split('@')[0] || 'You',
          message: data[0].message,
          timestamp: data[0].created_at,
          is_emergency: false,
          avatar_color: getAvatarColor(user.id),
          message_type: 'general'
        };
        
        console.log('Adding message to UI state:', newMsg);
        setMessages(prev => [newMsg, ...prev]);
      } else {
        console.log('No data returned from insert operation, using client-side data');
        const newMsg: Message = {
          id: Date.now().toString(),
          user_id: user.id,
          username: profile?.full_name || user?.email?.split('@')[0] || 'You',
          message: newMessage.trim(),
          timestamp: new Date().toISOString(),
          is_emergency: false,
          avatar_color: getAvatarColor(user.id),
          message_type: 'general'
        };
        
        console.log('Adding client-generated message to UI state:', newMsg);
        setMessages(prev => [newMsg, ...prev]);
      }
      
      // Clear the input
      setNewMessage('');
    } catch (err) {
      console.error('Error in sendMessage:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const addCommunityMember = () => {
    if (!newMember.username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    const member: CommunityMember = {
      id: Date.now().toString(),
      username: newMember.username.trim(),
      phone: newMember.phone.trim() || '+0000000000',
      avatar_color: newMember.avatar_color,
      is_online: true,
      last_seen: new Date().toISOString()
    };

    setCommunityMembers(prev => [...prev, member]);
    setNewMember({ username: '', phone: '', avatar_color: '#8B5CF6' });
    setShowAddContact(false);
    Alert.alert('Success', `${member.username} has been added to the community!`);
  };

  const sendCheckIn = async () => {
    if (!user) return;
    
    Alert.alert(
      'Safety Check-in',
      'Send a safety check-in to the community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check-in',
          onPress: async () => {
            try {
              // Save check-in message to database
              const { error } = await supabase
                .from('community_messages')
                .insert({
                  user_id: user.id,
                  message: 'I am safe and checking in with the community. All good here! 👍',
                  message_type: 'check-in',
                  is_emergency: false
                });
                
              if (error) {
                console.error('Error sending check-in:', error);
                Alert.alert('Error', 'Failed to send check-in');
                return;
              }
              
              Alert.alert('Check-in Sent', 'Your safety status has been shared with the community.');
            } catch (err) {
              console.error('Error in sendCheckIn:', err);
              Alert.alert('Error', 'Failed to send check-in');
            }
          }
        }
      ]
    );
  };

  const sendEmergencyAlert = async () => {
    if (!user) return;
    
    Alert.alert(
      'Send Emergency Alert',
      'This will send an emergency alert to all community members. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            try {
              // Save emergency message to database
              const { error } = await supabase
                .from('community_messages')
                .insert({
                  user_id: user.id,
                  message: 'EMERGENCY ALERT: Immediate assistance needed at my location. Please help!',
                  message_type: 'emergency',
                  is_emergency: true
                });
                
              if (error) {
                console.error('Error sending emergency alert:', error);
                Alert.alert('Error', 'Failed to send emergency alert');
                return;
              }
              
              Alert.alert('Alert Sent', 'Your emergency alert has been sent to the community');
            } catch (err) {
              console.error('Error in sendEmergencyAlert:', err);
              Alert.alert('Error', 'Failed to send emergency alert');
            }
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{ 
      marginHorizontal: 24, 
      marginVertical: 8, 
      padding: 16, 
      backgroundColor: item.is_emergency ? '#FEE2E2' : 'white',
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: item.is_emergency ? '#DC2626' : '#8B5CF6',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity 
          onPress={() => item.phone && setSelectedMember({
            id: item.user_id,
            username: item.username,
            avatar_color: item.avatar_color || '#8B5CF6',
            phone: item.phone!,
            is_online: true,
            last_seen: item.timestamp
          })}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: item.avatar_color || '#8B5CF6', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: 12
          }}
        >
          {item.is_emergency ? (
            <Ionicons name="warning" size={20} color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {item.username[0]?.toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: 'bold', 
            color: item.is_emergency ? '#991B1B' : '#1F2937' 
          }}>
            {item.username}
          </Text>
          <Text style={{ 
            fontSize: 12, 
            color: item.is_emergency ? '#7F1D1D' : '#6B7280' 
          }}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>

        {/* Add Contact Button */}
        {item.phone && !item.is_emergency && (
          <TouchableOpacity
            onPress={() => setSelectedMember({
              id: item.user_id,
              username: item.username,
              avatar_color: item.avatar_color || '#8B5CF6',
              phone: item.phone!,
              is_online: true,
              last_seen: item.timestamp
            })}
            style={{
              backgroundColor: '#7C3AED',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              marginRight: 8
            }}
          >
            <Ionicons name="person-add" size={16} color="white" />
          </TouchableOpacity>
        )}

        {item.is_emergency && (
          <View style={{ 
            backgroundColor: '#DC2626', 
            paddingHorizontal: 8, 
            paddingVertical: 4, 
            borderRadius: 12 
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              EMERGENCY
            </Text>
          </View>
        )}
      </View>

      <Text style={{ 
        fontSize: 15, 
        color: item.is_emergency ? '#991B1B' : '#374151',
        lineHeight: 20
      }}>
        {item.message}
      </Text>

      {item.is_emergency && (
        <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
          <TouchableOpacity style={{ 
            backgroundColor: '#DC2626', 
            paddingHorizontal: 16, 
            paddingVertical: 8, 
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name="call" size={16} color="white" style={{ marginRight: 6 }} />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ 
            backgroundColor: '#3B82F6', 
            paddingHorizontal: 16, 
            paddingVertical: 8, 
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name="location" size={16} color="white" style={{ marginRight: 6 }} />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Locate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
              Community
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                onPress={() => setShowAddContact(true)}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: 12
                }}
              >
                <Ionicons name="person-add" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/settings')}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Ionicons name="settings" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{onlineCount}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Online</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{alertCount}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Alerts</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Safe</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Status</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ 
          flex: 1, 
          backgroundColor: '#F8FAFC', 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          paddingTop: 20
        }}>
          {/* Quick Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 24, marginBottom: 20 }}>
            <TouchableOpacity 
              onPress={sendEmergencyAlert}
              style={{ alignItems: 'center' }}
            >
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#EF4444', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="warning" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={sendCheckIn}
              style={{ alignItems: 'center' }}
            >
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#3B82F6', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="location" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ alignItems: 'center' }}
              onPress={() => router.push('/safety-tips')}
            >
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#10B981', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="shield-checkmark" size={24} color="white" />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>Safety Tips</Text>
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16 }}>
                Loading community messages...
              </Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
              <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16, textAlign: 'center' }}>
                No messages yet.{'\n'}Be the first to post in the community!
              </Text>
            </View>
          ) : (
            /* Messages List */
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#8B5CF6']}
                  tintColor="#8B5CF6"
                />
              }
            />
          )}
        </View>

        {/* Message Input */}
        <View style={{ 
          backgroundColor: 'white', 
          paddingHorizontal: 24, 
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: '#F3F4F6', 
              borderRadius: 25, 
              paddingHorizontal: 16, 
              paddingVertical: 12,
              marginRight: 12
            }}>
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
                style={{ flex: 1, fontSize: 16, color: '#1F2937' }}
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={500}
              />
            </View>
            
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim()}
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                backgroundColor: newMessage.trim() ? '#8B5CF6' : '#E5E7EB', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? 'white' : '#9CA3AF'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Add Contact Modal */}
      <Modal
        visible={!!selectedMember}
        animationType="slide"
        transparent={true}
      >
        {selectedMember && (
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: selectedMember.avatar_color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 32, 
                    fontWeight: 'bold' 
                  }}>
                    {selectedMember.username[0]?.toUpperCase()}
                  </Text>
                </View>
                
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: 'bold', 
                  color: '#1F2937',
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  {selectedMember.username}
                </Text>
                
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6B7280',
                  textAlign: 'center'
                }}>
                  {selectedMember.phone}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Add to Contacts',
                      `Add ${selectedMember.username} to your contacts?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Add Contact',
                          onPress: () => {
                            // Navigate to contacts page to add this contact
                            router.push({
                              pathname: '/contacts',
                              params: {
                                addContact: 'true',
                                name: selectedMember.username,
                                phone: selectedMember.phone
                              }
                            });
                            setSelectedMember(null);
                          }
                        }
                      ]
                    );
                  }}
                  style={{
                    backgroundColor: '#7C3AED',
                    padding: 16,
                    borderRadius: 12,
                    flex: 1,
                    marginRight: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Add Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedMember(null)}
                  style={{
                    backgroundColor: '#6B7280',
                    padding: 16,
                    borderRadius: 12,
                    flex: 1,
                    marginLeft: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Add Community Member Modal */}
      <Modal
        visible={showAddContact}
        animationType="slide"
        transparent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            maxHeight: height * 0.7
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
                Add Community Member
              </Text>
              <TouchableOpacity onPress={() => setShowAddContact(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Username *
              </Text>
              <TextInput
                value={newMember.username}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, username: text }))}
                placeholder="Enter username"
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Phone Number (Optional)
              </Text>
              <TextInput
                value={newMember.phone}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 16
                }}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                Avatar Color
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {['#8B5CF6', '#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#EC4899'].map(color => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setNewMember(prev => ({ ...prev, avatar_color: color }))}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: newMember.avatar_color === color ? 3 : 0,
                      borderColor: '#1F2937'
                    }}
                  >
                    {newMember.avatar_color === color && (
                      <Ionicons name="checkmark" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={addCommunityMember}
              style={{
                backgroundColor: '#8B5CF6',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 8
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Add to Community
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
