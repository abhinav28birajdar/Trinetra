import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
      )}
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && (
          <Text style={styles.username}>{message.username}</Text>
        )}
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 16,
  },
  currentUserMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: '#E6E6FA',
    borderBottomLeftRadius: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
  },
  currentUserText: {
    color: Colors.text.light,
  },
  otherUserText: {
    color: Colors.text.dark,
  },
});