import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Send } from 'lucide-react-native';
import { useCommunityStore } from '@/store/community-store';
import { useUserStore } from '@/store/user-store';
import { CommunityPost as CommunityPostComponent } from '@/components/CommunityPost';
import Colors from '@/constants/colors';

export default function CommunityScreen() {
  const { posts, addPost, likePost } = useCommunityStore();
  const { user } = useUserStore();
  const [newPostContent, setNewPostContent] = useState('');
  
  const handleAddPost = () => {
    if (!newPostContent.trim() || !user) return;
    
    addPost({
      userId: user.id,
      userName: user.name,
      userImage: user.profileImage,
      content: newPostContent.trim(),
    });
    
    setNewPostContent('');
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <Text style={styles.subtitle}>Connect, Share, and Stay Informed</Text>
      </View>
      
      <ScrollView 
        style={styles.postsContainer}
        contentContainerStyle={styles.postsContent}
      >
        {posts.length > 0 ? (
          posts.map(post => (
            <CommunityPostComponent
              key={post.id}
              post={post}
              onLike={likePost}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No community posts yet. Be the first to share!
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Share a safety tip or ask for advice..."
          placeholderTextColor={Colors.gray[500]}
          value={newPostContent}
          onChangeText={setNewPostContent}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !newPostContent.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleAddPost}
          disabled={!newPostContent.trim()}
        >
          <Send size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
  postsContainer: {
    flex: 1,
  },
  postsContent: {
    padding: 16,
    paddingBottom: 16,
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyStateText: {
    color: Colors.subtext,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
});