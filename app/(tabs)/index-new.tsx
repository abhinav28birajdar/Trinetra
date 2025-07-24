import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Database } from '../../types/supabase';

type Contact = Database['public']['Tables']['contacts']['Row'];
type CallLog = Database['public']['Tables']['call_logs']['Row'];

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCalls: 0,
    missedCalls: 0,
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch recent contacts
      const { data: contacts } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Fetch recent calls
      const { data: calls } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      // Fetch stats
      const { count: totalContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      const { count: totalCalls } = await supabase
        .from('call_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      const { count: missedCalls } = await supabase
        .from('call_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('call_type', 'missed');

      setRecentContacts(contacts || []);
      setRecentCalls(calls || []);
      setStats({
        totalContacts: totalContacts || 0,
        totalCalls: totalCalls || 0,
        missedCalls: missedCalls || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  // Make a call
  const makeCall = async (phoneNumber: string, contactName: string | null = null) => {
    try {
      // Log the call
      if (user) {
        await supabase.from('call_logs').insert({
          user_id: user.id,
          phone_number: phoneNumber,
          contact_name: contactName,
          call_type: 'outgoing',
          timestamp: new Date().toISOString(),
          duration: 0,
        });
      }

      const phoneUrl = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make call');
      console.error('Make call error:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">
          {getGreeting()}, {profile?.full_name || 'User'}!
        </Text>
        <Text className="text-purple-200 mt-1">
          Welcome to Trinatra
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-white p-4 rounded-xl items-center flex-1 mr-2 shadow-sm"
              onPress={() => router.push('/(tabs)/contacts')}
            >
              <View className="bg-green-100 p-3 rounded-full mb-2">
                <Ionicons name="people" size={24} color="#10B981" />
              </View>
              <Text className="text-gray-800 font-semibold">Contacts</Text>
              <Text className="text-gray-500 text-sm">{stats.totalContacts}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-4 rounded-xl items-center flex-1 mx-1 shadow-sm"
              onPress={() => router.push('/(tabs)/call-logs')}
            >
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <Ionicons name="call" size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-800 font-semibold">Call Logs</Text>
              <Text className="text-gray-500 text-sm">{stats.totalCalls}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-4 rounded-xl items-center flex-1 ml-2 shadow-sm"
              onPress={() => router.push('/(tabs)/live-location')}
            >
              <View className="bg-purple-100 p-3 rounded-full mb-2">
                <Ionicons name="location" size={24} color="#8B5CF6" />
              </View>
              <Text className="text-gray-800 font-semibold">Location</Text>
              <Text className="text-gray-500 text-sm">Live</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Overview</Text>
          <View className="flex-row justify-between">
            <View className="bg-white p-4 rounded-xl flex-1 mr-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-gray-800">{stats.totalCalls}</Text>
                  <Text className="text-gray-500">Total Calls</Text>
                </View>
                <Ionicons name="call-outline" size={24} color="#6B7280" />
              </View>
            </View>

            <View className="bg-white p-4 rounded-xl flex-1 ml-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-red-500">{stats.missedCalls}</Text>
                  <Text className="text-gray-500">Missed Calls</Text>
                </View>
                <Ionicons name="call-outline" size={24} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Numbers */}
        <View className="px-4 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Emergency</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-xl items-center flex-1 mr-2 shadow-sm"
              onPress={() => makeCall('100')}
            >
              <Ionicons name="shield" size={24} color="white" />
              <Text className="text-white font-bold text-lg mt-2">100</Text>
              <Text className="text-white text-sm">Police</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-xl items-center flex-1 mx-1 shadow-sm"
              onPress={() => makeCall('181')}
            >
              <Ionicons name="medical" size={24} color="white" />
              <Text className="text-white font-bold text-lg mt-2">181</Text>
              <Text className="text-white text-sm">Ambulance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-orange-500 p-4 rounded-xl items-center flex-1 ml-2 shadow-sm"
              onPress={() => makeCall('199')}
            >
              <Ionicons name="flame" size={24} color="white" />
              <Text className="text-white font-bold text-lg mt-2">199</Text>
              <Text className="text-white text-sm">Fire</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <View className="px-4 pb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Recent Contacts</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/contacts')}>
                <Text className="text-primary font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {recentContacts.slice(0, 3).map((contact) => (
              <TouchableOpacity
                key={contact.id}
                className="bg-white p-4 rounded-xl mb-2 shadow-sm"
                onPress={() => makeCall(contact.phone, contact.name)}
              >
                <View className="flex-row items-center">
                  <View className="bg-gray-100 p-3 rounded-full mr-3">
                    <Ionicons name="person" size={20} color="#6B7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{contact.name}</Text>
                    <Text className="text-gray-500 text-sm">{contact.phone}</Text>
                  </View>
                  <Ionicons name="call" size={20} color="#10B981" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
