import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Linking,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Database } from '../../types/supabase';

type CallLog = Database['public']['Tables']['call_logs']['Row'];

export default function CallLogsScreen() {
  const { user } = useAuthStore();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch call logs from Supabase
  const fetchCallLogs = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      Alert.alert('Error', 'Failed to fetch call logs');
      console.error('Fetch call logs error:', error);
    } else {
      setCallLogs(data || []);
    }
    setLoading(false);
  };

  // Make a return call
  const makeCall = async (phoneNumber: string, contactName: string | null) => {
    try {
      // Log the call attempt
      if (user) {
        await logCall({
          user_id: user.id,
          phone_number: phoneNumber,
          contact_name: contactName,
          call_type: 'outgoing',
          timestamp: new Date().toISOString(),
          duration: 0,
        });
      }

      // Make the call
      const phoneUrl = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        await Linking.openURL(phoneUrl);
        // Refresh call logs after making a call
        setTimeout(fetchCallLogs, 1000);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make call');
      console.error('Make call error:', error);
    }
  };

  // Log call to database
  const logCall = async (callData: Database['public']['Tables']['call_logs']['Insert']) => {
    const { error } = await supabase
      .from('call_logs')
      .insert(callData);

    if (error) {
      console.error('Failed to log call:', error);
    }
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return 'No answer';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get call type icon and color
  const getCallTypeIcon = (callType: string) => {
    switch (callType) {
      case 'incoming':
        return { name: 'call-outline' as const, color: '#10B981' };
      case 'outgoing':
        return { name: 'call' as const, color: '#3B82F6' };
      case 'missed':
        return { name: 'call-outline' as const, color: '#EF4444' };
      default:
        return { name: 'call-outline' as const, color: '#6B7280' };
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCallLogs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCallLogs();
  }, [user]);

  const renderCallLog = ({ item }: { item: CallLog }) => {
    const callIcon = getCallTypeIcon(item.call_type);
    
    return (
      <View className="bg-white mx-4 mb-2 p-4 rounded-lg shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="mr-3">
              <Ionicons name={callIcon.name} size={24} color={callIcon.color} />
            </View>
            
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {item.contact_name || item.phone_number}
              </Text>
              {item.contact_name && (
                <Text className="text-gray-500 text-sm">{item.phone_number}</Text>
              )}
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400 text-xs capitalize mr-2">
                  {item.call_type}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {formatDuration(item.duration)}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-gray-400 text-sm mb-2">
              {formatTimestamp(item.timestamp)}
            </Text>
            <TouchableOpacity
              className="bg-green-500 p-2 rounded-full"
              onPress={() => makeCall(item.phone_number, item.contact_name)}
            >
              <Ionicons name="call" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">Call Logs</Text>
        <Text className="text-purple-200 mt-1">
          Recent calls and activity
        </Text>
      </View>

      {/* Call Logs List */}
      {callLogs.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="call-outline" size={80} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg font-semibold mt-4 text-center">
            No Call History
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Your call history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={callLogs}
          renderItem={renderCallLog}
          keyExtractor={(item: CallLog) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
