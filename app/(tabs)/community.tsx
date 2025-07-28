import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([
    {
      id: 'demo1',
      username: 'Sarah M.',
      avatar_color: '#EF4444',
      phone: '+1234567890',
      is_online: true,
      last_seen: new Date().toISOString()
    },
    {
      id: 'demo3',
      username: 'Mike R.',
      avatar_color: '#3B82F6',
      phone: '+1234567892',
      is_online: false,
      last_seen: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user_id: 'demo1',
      username: 'Sarah M.',
      message: 'Is everyone safe after the weather alert? Checking in from downtown area.',
      timestamp: '2025-01-24T15:30:00Z',
      is_emergency: false,
      avatar_color: '#EF4444',
      phone: '+1234567890'
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
      avatar_color: '#3B82F6',
      phone: '+1234567892'
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

  const sendCheckIn = () => {
    Alert.alert(
      'Safety Check-in',
      'Send a safety check-in to the community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check-in',
          onPress: () => {
            const checkInMessage: Message = {
              id: Date.now().toString(),
              user_id: user?.id || 'current_user',
              username: profile?.full_name || 'You',
              message: 'I am safe and checking in with the community. All good here! 👍',
              timestamp: new Date().toISOString(),
              is_emergency: false,
              avatar_color: '#3B82F6'
            };
            setMessages([checkInMessage, ...messages]);
            Alert.alert('Check-in Sent', 'Your safety status has been shared with the community.');
          }
        }
      ]
    );
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
