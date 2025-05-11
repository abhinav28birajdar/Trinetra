import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/colors';
import { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
}) => {
  const { user } = useAuthStore();
  const isCurrentUser = user?.id === message.userId;
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
    ]}>
      {!isCurrentUser && (
        <Text style={styles.username}>{message.username}</Text>
      )}
      <Text style={styles.content}>{message.content}</Text>
      <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: Colors.white,
  },
  time: {
    fontSize: 10,
    color: Colors.white,
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default MessageItem;