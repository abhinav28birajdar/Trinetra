import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SafetyTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
}

const safetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Trust Your Instincts',
    description: 'If something feels wrong, it probably is. Trust your gut feeling and remove yourself from uncomfortable situations immediately. Your intuition is a powerful safety tool.',
    icon: 'alert-circle',
    category: 'General Safety',
    color: '#EF4444'
  },
  {
    id: '2',
    title: 'Share Your Location',
    description: 'Always let trusted contacts know where you are going and when you expect to return. Use location sharing features and check in regularly with family or friends.',
    icon: 'location',
    category: 'Location Safety',
    color: '#10B981'
  },
  {
    id: '3',
    title: 'Emergency Numbers',
    description: 'Keep emergency numbers easily accessible. Police: 100, Fire: 101, Medical: 102, Women Helpline: 1091. Program these into your phone and know them by heart.',
    icon: 'call',
    category: 'Emergency',
    color: '#DC2626'
  },
  {
    id: '4',
    title: 'Stay Connected',
    description: 'Keep your phone charged and carry a portable charger. Communication is vital in emergencies. Consider having backup communication methods.',
    icon: 'battery-charging',
    category: 'Technology',
    color: '#3B82F6'
  },
  {
    id: '5',
    title: 'Safe Transportation',
    description: 'Use verified transportation apps, share ride details with contacts, and sit behind the driver. Avoid empty or poorly lit transport stops.',
    icon: 'car',
    category: 'Transport',
    color: '#F59E0B'
  },
  {
    id: '6',
    title: 'Personal Safety Items',
    description: 'Carry a whistle, pepper spray (where legal), or personal alarm. These items can help deter attackers and alert others to your situation.',
    icon: 'shield',
    category: 'Personal Defense',
    color: '#8B5CF6'
  },
  {
    id: '7',
    title: 'Avoid Isolation',
    description: 'Stay in well-lit, populated areas especially at night. Avoid shortcuts through isolated areas. There is safety in numbers and visibility.',
    icon: 'people',
    category: 'Environment',
    color: '#06B6D4'
  },
  {
    id: '8',
    title: 'Home Security',
    description: 'Keep doors and windows locked. Install good lighting around entrances. Don\'t open doors to strangers and use peepholes or security cameras.',
    icon: 'home',
    category: 'Home Safety',
    color: '#84CC16'
  }
];

export default function SafetyTipsScreen() {
  const [selectedTip, setSelectedTip] = useState<SafetyTip | null>(null);

  const renderTipCard = (tip: SafetyTip) => (
    <TouchableOpacity
      key={tip.id}
      onPress={() => setSelectedTip(tip)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: tip.color,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          backgroundColor: tip.color + '20',
          padding: 12,
          borderRadius: 12,
          marginRight: 16
        }}>
          <Ionicons name={tip.icon as any} size={24} color={tip.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: '#1F2937',
            marginBottom: 4
          }}>
            {tip.title}
          </Text>
          <Text style={{ 
            fontSize: 12, 
            color: tip.color,
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            {tip.category}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
      <Text style={{ 
        fontSize: 14, 
        color: '#6B7280',
        lineHeight: 20
      }}>
        {tip.description.substring(0, 100)}...
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <LinearGradient
        colors={['#7C3AED', '#A855F7', '#C084FC']}
        style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 10,
              borderRadius: 10
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
            Safety Tips
          </Text>
          
          <View style={{ width: 44 }} />
        </View>
        
        <Text style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: 16, 
          textAlign: 'center',
          marginTop: 12 
        }}>
          Essential safety knowledge for everyone
        </Text>
      </LinearGradient>

      {/* Tips List */}
      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {safetyTips.map(renderTipCard)}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Detailed Tip Modal */}
      <Modal
        visible={!!selectedTip}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedTip && (
          <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <LinearGradient
              colors={[selectedTip.color, selectedTip.color + 'CC']}
              style={{ paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => setSelectedTip(null)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 10,
                    borderRadius: 10
                  }}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                
                <View style={{ alignItems: 'center', flex: 1, marginHorizontal: 20 }}>
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 12
                  }}>
                    <Ionicons name={selectedTip.icon as any} size={32} color="white" />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                    {selectedTip.title}
                  </Text>
                </View>
                
                <View style={{ width: 44 }} />
              </View>
            </LinearGradient>

            <ScrollView style={{ flex: 1, padding: 20 }}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}>
                <View style={{ 
                  backgroundColor: selectedTip.color + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                  marginBottom: 20
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: selectedTip.color,
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    {selectedTip.category}
                  </Text>
                </View>
                
                <Text style={{ 
                  fontSize: 18, 
                  color: '#374151',
                  lineHeight: 28
                }}>
                  {selectedTip.description}
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}
