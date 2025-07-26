import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../store/auth';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  is_emergency?: boolean;
  avatar_color?: string;
}

export default function CommunityScreen() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user_id: 'demo1',
      username: 'Sarah M.',
      message: 'Is everyone safe after the weather alert? Checking in from downtown area.',
      timestamp: '2025-01-24T15:30:00Z',
      is_emergency: false,
      avatar_color: '#EF4444'
    },
    {
      id: '2',
      user_id: 'system',
      username: 'Emergency Alert',
      message: 'WEATHER ALERT: Severe thunderstorm warning in effect until 6 PM. Please stay indoors.',
      timestamp: '2025-01-24T15:15:00Z',
      is_emergency: true,
      avatar_color: '#DC2626'
    },
    {
      id: '3',
      user_id: 'demo3',
      username: 'Mike R.',
      message: 'Road closure on Main St due to fallen tree. Use alternate routes.',
      timestamp: '2025-01-24T14:45:00Z',
      is_emergency: false,
      avatar_color: '#3B82F6'
    },
    {
      id: '4',
      user_id: 'demo4',
      username: 'Anna K.',
      message: 'Lost dog in Oak Park area. Small brown terrier named Max. Please contact if found.',
      timestamp: '2025-01-24T14:20:00Z',
      is_emergency: false,
      avatar_color: '#10B981'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user_id: user?.id || 'current_user',
      username: profile?.full_name || user?.email?.split('@')[0] || 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      is_emergency: false,
      avatar_color: '#8B5CF6'
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const sendEmergencyAlert = () => {
    Alert.alert(
      'Send Emergency Alert',
      'This will send an emergency alert to all community members. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            const emergencyMessage: Message = {
              id: Date.now().toString(),
              user_id: user?.id || 'current_user',
              username: profile?.full_name || 'Emergency Alert',
              message: 'EMERGENCY ALERT: Immediate assistance needed at my location. Please help!',
              timestamp: new Date().toISOString(),
              is_emergency: true,
              avatar_color: '#DC2626'
            };
            setMessages([emergencyMessage, ...messages]);
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
        <View style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: item.avatar_color || '#8B5CF6', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: 12
        }}>
          {item.is_emergency ? (
            <Ionicons name="warning" size={20} color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {item.username[0]?.toUpperCase()}
            </Text>
          )}
        </View>
        
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
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="people-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>124</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Online</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>2</Text>
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

            <TouchableOpacity style={{ alignItems: 'center' }}>
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

            <TouchableOpacity style={{ alignItems: 'center' }}>
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

          {/* Messages List */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
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
    </View>
  );
}
