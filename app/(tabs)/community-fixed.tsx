import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import AppHeader from '../../components/AppHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Database } from '../../types/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// For now, we'll create a simple placeholder since there's no messages table in the schema
interface Message {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export default function CommunityScreen() {
    const { user, profile } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList<Message>>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    // Placeholder data since we don't have messages table
    useEffect(() => {
        setLoading(false);
        // Add some sample messages
        const sampleMessages: Message[] = [
            {
                id: '1',
                content: 'Welcome to the community!',
                user_id: 'system',
                created_at: new Date().toISOString(),
                profiles: {
                    full_name: 'System',
                    avatar_url: null
                }
            },
            {
                id: '2',
                content: 'This is a placeholder for the community chat feature.',
                user_id: 'system',
                created_at: new Date().toISOString(),
                profiles: {
                    full_name: 'System',
                    avatar_url: null
                }
            }
        ];
        setMessages(sampleMessages);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages.length]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        setSending(true);
        
        // For now, just add locally since we don't have messages table
        const message: Message = {
            id: Date.now().toString(),
            content: newMessage.trim(),
            user_id: user.id,
            created_at: new Date().toISOString(),
            profiles: {
                full_name: profile?.full_name || 'User',
                avatar_url: profile?.avatar_url || null
            }
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
        setSending(false);

        // Scroll to bottom after sending
        setTimeout(scrollToBottom, 100);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwnMessage = item.user_id === user?.id;
        const avatarUrl = item.profiles?.avatar_url;
        const senderName = item.profiles?.full_name || 'Unknown User';

        return (
            <View className={`flex-row mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {!isOwnMessage && (
                    <Image
                        source={avatarUrl ? { uri: avatarUrl } : { uri: 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=U' }}
                        className="w-8 h-8 rounded-full mr-2 mt-1"
                    />
                )}
                <View className={`max-w-xs px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-primary' : 'bg-gray-200'}`}>
                    {!isOwnMessage && (
                        <Text className="text-xs text-gray-600 mb-1 font-medium">{senderName}</Text>
                    )}
                    <Text className={`${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
                        {item.content}
                    </Text>
                    <Text className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-200' : 'text-gray-500'}`}>
                        {formatTime(item.created_at)}
                    </Text>
                </View>
                {isOwnMessage && (
                    <Image
                        source={profile?.avatar_url ? { uri: profile.avatar_url } : { uri: 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=U' }}
                        className="w-8 h-8 rounded-full ml-2 mt-1"
                    />
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50">
                <AppHeader title="Community" />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#6B21A8" />
                    <Text className="mt-4 text-gray-600">Loading messages...</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <AppHeader title="Community" />
            
            <View className="flex-1 px-4">
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    className="flex-1 py-4"
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
                />
            </View>

            {/* Message Input */}
            <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-200">
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className={`p-2 rounded-full ${newMessage.trim() && !sending ? 'bg-primary' : 'bg-gray-300'}`}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="send" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
