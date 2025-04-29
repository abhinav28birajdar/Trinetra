import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Platform,
  SafeAreaView
} from "react-native";
import { Camera, Video, Mic, FileText, Plus, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Button } from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { EvidenceItem } from "@/types";

export default function EvidenceScreen() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  
  const capturePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newItem: EvidenceItem = {
          id: Date.now().toString(),
          type: "photo",
          uri: result.assets[0].uri,
          timestamp: new Date(),
          description: "Photo evidence"
        };
        
        setEvidenceItems(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo");
    }
  };
  
  const captureVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newItem: EvidenceItem = {
          id: Date.now().toString(),
          type: "video",
          uri: result.assets[0].uri,
          timestamp: new Date(),
          description: "Video evidence"
        };
        
        setEvidenceItems(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error("Error capturing video:", error);
      Alert.alert("Error", "Failed to capture video");
    }
  };
  
  const recordAudio = () => {
    // In a real app, this would use expo-av to record audio
    Alert.alert("Record Audio", "Audio recording would be implemented here");
  };
  
  const addNote = () => {
    // In a real app, this would open a text input modal
    Alert.alert("Add Note", "Note taking would be implemented here");
  };
  
  const deleteItem = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to delete this evidence?")) {
        setEvidenceItems(prev => prev.filter(item => item.id !== id));
      }
    } else {
      Alert.alert(
        "Delete Evidence",
        "Are you sure you want to delete this evidence?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive", 
            onPress: () => setEvidenceItems(prev => prev.filter(item => item.id !== id)) 
          }
        ]
      );
    }
  };
  
  const renderEvidenceItem = ({ item }: { item: EvidenceItem }) => {
    const formatDate = (date: Date) => {
      return date.toLocaleString();
    };
    
    return (
      <View style={styles.evidenceItem}>
        {item.type === "photo" && (
          <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
        )}
        
        {item.type === "video" && (
          <View style={styles.evidenceVideo}>
            <Video size={32} color={Colors.white} />
          </View>
        )}
        
        {item.type === "audio" && (
          <View style={styles.evidenceAudio}>
            <Mic size={32} color={Colors.white} />
          </View>
        )}
        
        {item.type === "note" && (
          <View style={styles.evidenceNote}>
            <FileText size={32} color={Colors.white} />
          </View>
        )}
        
        <View style={styles.evidenceInfo}>
          <Text style={styles.evidenceType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.evidenceTimestamp}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.evidenceDescription}>{item.description}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Trash2 size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Capture and store evidence securely. All evidence is stored locally on your device.
        </Text>
      </View>
      
      <View style={styles.captureOptions}>
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: Colors.primary }]}
          onPress={capturePhoto}
        >
          <Camera size={24} color={Colors.white} />
          <Text style={styles.captureButtonText}>Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: Colors.secondary }]}
          onPress={captureVideo}
        >
          <Video size={24} color={Colors.white} />
          <Text style={styles.captureButtonText}>Video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: Colors.info }]}
          onPress={recordAudio}
        >
          <Mic size={24} color={Colors.white} />
          <Text style={styles.captureButtonText}>Audio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, { backgroundColor: Colors.success }]}
          onPress={addNote}
        >
          <FileText size={24} color={Colors.white} />
          <Text style={styles.captureButtonText}>Note</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.evidenceContainer}>
        <Text style={styles.sectionTitle}>Saved Evidence</Text>
        
        {evidenceItems.length > 0 ? (
          <FlatList
            data={evidenceItems}
            keyExtractor={item => item.id}
            renderItem={renderEvidenceItem}
            contentContainerStyle={styles.evidenceList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No evidence captured yet. Use the buttons above to capture evidence.
            </Text>
            <Button
              title="Capture Evidence"
              leftIcon={<Plus size={20} color={Colors.white} />}
              onPress={capturePhoto}
              style={styles.captureEvidenceButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    backgroundColor: Colors.tertiary,
    padding: 16,
  },
  headerText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
  },
  captureOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  captureButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  captureButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  evidenceContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  evidenceList: {
    paddingBottom: 16,
  },
  evidenceItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  evidenceImage: {
    width: 80,
    height: 80,
  },
  evidenceVideo: {
    width: 80,
    height: 80,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  evidenceAudio: {
    width: 80,
    height: 80,
    backgroundColor: Colors.info,
    justifyContent: "center",
    alignItems: "center",
  },
  evidenceNote: {
    width: 80,
    height: 80,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  evidenceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  evidenceType: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  evidenceTimestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  evidenceDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  captureEvidenceButton: {
    width: "100%",
  }
});