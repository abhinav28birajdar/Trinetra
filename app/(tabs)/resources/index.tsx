import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  BookOpen, 
  Phone, 
  Camera, 
  Info, 
  ChevronRight 
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  imageUrl?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  icon,
  onPress,
  imageUrl
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </View>
    {imageUrl && (
      <Image 
        source={{ uri: imageUrl }}
        style={styles.cardImage}
      />
    )}
  </TouchableOpacity>
);

export default function ResourcesScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Safety Resources</Text>
          <Text style={styles.subtitle}>
            Access helpful resources to stay safe and informed.
          </Text>
        </View>
        
        <ResourceCard
          title="Safety Tips"
          description="Learn essential safety practices for various situations."
          icon={<BookOpen size={24} color={colors.primary} />}
          onPress={() => router.push('./safety-tips')}
          imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        />
        
        <ResourceCard
          title="Emergency Helplines"
          description="Quick access to important emergency contact numbers."
          icon={<Phone size={24} color={colors.danger} />}
          onPress={() => router.push('./helplines')}
          imageUrl="https://images.unsplash.com/photo-1581574919402-5b7d688419a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        />
        
        <ResourceCard
          title="Capture Evidence"
          description="Record photos, videos, or audio in unsafe situations."
          icon={<Camera size={24} color={colors.info} />}
          onPress={() => router.push('./evidence')}
          imageUrl="https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        />
        
        <ResourceCard
          title="About SheSafe"
          description="Learn more about the app and its features."
          icon={<Info size={24} color={colors.secondary} />}
          onPress={() => router.push('./about')}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Did You Know?</Text>
          <Text style={styles.infoText}>
            Sharing your live location with trusted contacts can increase your safety by up to 60% in emergency situations.
          </Text>
        </View>
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
    marginBottom: 24,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  infoContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});