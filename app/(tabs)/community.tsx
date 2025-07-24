import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../store/auth';

interface Message {
  id: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
  is_emergency?: boolean;
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
      is_emergency: false
    },
    {
      id: '2',
      user_id: 'demo2',
      username: 'Emergency Alert System',
      message: 'WEATHER ALERT: Severe thunderstorm warning in effect until 6 PM. Please stay indoors.',
      timestamp: '2025-01-24T15:15:00Z',
      is_emergency: true
    },
    {
      id: '3',
      user_id: 'demo3',
      username: 'Mike R.',
      message: 'Road closure on Main St due to fallen tree. Use alternate routes.',
      timestamp: '2025-01-24T14:45:00Z',
      is_emergency: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsLoading(true);
    
    // Simulate sending message
    const message: Message = {
      id: Date.now().toString(),
      user_id: user?.id || '',
      username: profile?.full_name || user?.email?.split('@')[0] || 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      is_emergency: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setIsLoading(false);
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
              user_id: user?.id || '',
              username: profile?.full_name || user?.email?.split('@')[0] || 'You',
              message: 'EMERGENCY ALERT: Requesting immediate assistance at my location.',
              timestamp: new Date().toISOString(),
              is_emergency: true
            };
            
            setMessages(prev => [emergencyMessage, ...prev]);
            Alert.alert('Emergency Alert Sent', 'Your emergency alert has been sent to the community.');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopHeader title="Community Chat" />
      
      <View className="flex-1 px-4">
        {/* Emergency Alert Button */}
        <View className="py-4">
          <TouchableOpacity
            onPress={sendEmergencyAlert}
            className="bg-red-600 rounded-xl p-4 flex-row items-center justify-center"
          >
            <Ionicons name="warning" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Send Emergency Alert
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 p-4 rounded-xl ${
                message.is_emergency 
                  ? 'bg-red-50 border border-red-200' 
                  : message.user_id === user?.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-white border border-gray-200'
              }`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  {message.is_emergency && (
                    <Ionicons name="warning" size={16} color="#dc2626" />
                  )}
                  <Text 
                    className={`font-semibold text-sm ml-1 ${
                      message.is_emergency ? 'text-red-700' : 'text-gray-700'
                    }`}
                  >
                    {message.username}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs">
                  {formatTimestamp(message.timestamp)}
                </Text>
              </View>
              
              <Text 
                className={`text-base ${
                  message.is_emergency ? 'text-red-800 font-medium' : 'text-gray-800'
                }`}
              >
                {message.message}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View className="flex-row items-center p-4 bg-white rounded-xl border border-gray-200 mb-4">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message to the community..."
            multiline
            className="flex-1 text-gray-900 max-h-20"
            style={{ minHeight: 40 }}
          />
          
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
              isLoading || !newMessage.trim() ? 'bg-gray-300' : 'bg-blue-600'
            }`}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={isLoading || !newMessage.trim() ? '#9ca3af' : 'white'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
