import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

const { width } = Dimensions.get('window');

interface CallLog {
  id: string;
  phone_number: string;
  contact_name: string;
  call_type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration: number;
}

export default function CallLogsScreen() {
  const { user } = useAuthStore();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCallLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCallLogs(data || []);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      Alert.alert('Error', 'Failed to load call logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCallLogs();
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Not connected';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCallIcon = (callType: string) => {
    switch (callType) {
      case 'incoming':
        return 'call-outline';
      case 'outgoing':
        return 'call-outline';
      case 'missed':
        return 'call-outline';
      default:
        return 'call-outline';
    }
  };

  const getCallColor = (callType: string) => {
    switch (callType) {
      case 'incoming':
        return '#10B981';
      case 'outgoing':
        return '#8B5CF6';
      case 'missed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleCallPress = (phoneNumber: string, contactName: string) => {
    Alert.alert(
      'Call ' + contactName,
      `Would you like to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          }
        }
      ]
    );
  };

  const renderCallLogItem = ({ item }: { item: CallLog }) => (
    <TouchableOpacity
      onPress={() => handleCallPress(item.phone_number, item.contact_name)}
      style={{
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 4,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${getCallColor(item.call_type)}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
      }}>
        <Ionicons 
          name="call-outline" 
          size={24} 
          color={getCallColor(item.call_type)}
          style={{
            transform: item.call_type === 'incoming' ? [{ rotate: '135deg' }] : 
                     item.call_type === 'missed' ? [{ rotate: '45deg' }] : []
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: 4
        }}>
          {item.contact_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            marginRight: 8
          }}>
            {item.phone_number}
          </Text>
          <View style={{
            backgroundColor: `${getCallColor(item.call_type)}20`,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12
          }}>
            <Text style={{
              fontSize: 12,
              color: getCallColor(item.call_type),
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {item.call_type}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{
          fontSize: 12,
          color: '#9CA3AF',
          marginBottom: 4
        }}>
          {formatTimestamp(item.timestamp)}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
          fontWeight: '500'
        }}>
          {formatDuration(item.duration)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingTop: 100
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        <Ionicons name="call-outline" size={40} color="#8B5CF6" />
      </View>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center'
      }}>
        No Call History
      </Text>
      <Text style={{
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24
      }}>
        Your call logs will appear here when you make emergency calls through the app.
      </Text>
    </View>
  );

  const callStats = {
    total: callLogs.length,
    incoming: callLogs.filter(log => log.call_type === 'incoming').length,
    outgoing: callLogs.filter(log => log.call_type === 'outgoing').length,
    missed: callLogs.filter(log => log.call_type === 'missed').length
  };

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
          <Text style={{
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 16
          }}>
            Call Logs
          </Text>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 16
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {callStats.total}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Total
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {callStats.outgoing}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Outgoing
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {callStats.incoming}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Incoming
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {callStats.missed}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Missed
              </Text>
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
          {callLogs.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={callLogs}
              renderItem={renderCallLogItem}
              keyExtractor={(item) => item.id}
              onRefresh={onRefresh}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </LinearGradient>

      {/* Floating Emergency Call Button */}
      <TouchableOpacity
        onPress={() => Linking.openURL('tel:100')}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#EF4444',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <Ionicons name="call" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
