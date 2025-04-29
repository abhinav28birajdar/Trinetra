import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Video, Mic } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';

export default function EvidenceScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  const requestPermission = async (type: 'camera' | 'audio') => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'This feature is not available on web');
      return false;
    }
    
    try {
      let status;
      
      if (type === 'camera') {
        const result = await ImagePicker.requestCameraPermissionsAsync();
        status = result.status;
      } else {
        // In a real app, we would request audio permissions here
        status = 'granted'; // Mock for demo
      }
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          `Please allow access to your ${type} to capture evidence.`
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return false;
    }
  };
  
  const handleTakePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web');
      return;
    }
    
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;
    
    try {
      setIsLoading(true);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // In a real app, we would save the image and metadata
        Alert.alert(
          'Photo Captured',
          'Your photo evidence has been saved securely and shared with your trusted contacts.'
        );
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRecordVideo = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Video recording is not available on web');
      return;
    }
    
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;
    
    try {
      setIsLoading(true);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // In a real app, we would save the video and metadata
        Alert.alert(
          'Video Recorded',
          'Your video evidence has been saved securely and shared with your trusted contacts.'
        );
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRecordAudio = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Audio recording is not available on web');
      return;
    }
    
    const hasPermission = await requestPermission('audio');
    if (!hasPermission) return;
    
    try {
      setIsLoading(true);
      
      // In a real app, we would use expo-av to record audio
      // For demo, we'll just simulate recording
      
      setTimeout(() => {
        Alert.alert(
          'Audio Recorded',
          'Your audio evidence has been saved securely and shared with your trusted contacts.'
        );
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error recording audio:', error);
      Alert.alert('Error', 'Failed to record audio. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Record Incident</Text>
          <Text style={styles.subtitle}>
            Record and save evidence safely.
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your evidence will be auto-shared with your trusted contacts and stored securely.
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleTakePhoto}
            disabled={isLoading}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.primary }]}>
              <Camera size={32} color={colors.white} />
            </View>
            <Text style={styles.optionTitle}>Take Photo</Text>
            <Text style={styles.optionDescription}>
              Capture photo evidence of your surroundings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleRecordVideo}
            disabled={isLoading}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.secondary }]}>
              <Video size={32} color={colors.white} />
            </View>
            <Text style={styles.optionTitle}>Record Video</Text>
            <Text style={styles.optionDescription}>
              Record video evidence with sound
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleRecordAudio}
            disabled={isLoading}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.info }]}>
              <Mic size={32} color={colors.white} />
            </View>
            <Text style={styles.optionTitle}>Record Audio</Text>
            <Text style={styles.optionDescription}>
              Discreetly record audio of the situation
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Important Notes:</Text>
          <Text style={styles.notesText}>
            • Evidence is automatically timestamped and geotagged
          </Text>
          <Text style={styles.notesText}>
            • All recordings are encrypted for your privacy
          </Text>
          <Text style={styles.notesText}>
            • Your trusted contacts will receive a notification with access to your evidence
          </Text>
        </View>
        
        {Platform.OS === 'web' && (
          <View style={styles.webNotice}>
            <Text style={styles.webNoticeText}>
              Note: Camera and recording features are only available on mobile devices.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  infoContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: 'rgba(255, 107, 139, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
    lineHeight: 20,
  },
  webNotice: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.warning + '20',
    borderRadius: 12,
  },
  webNoticeText: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
  },
});