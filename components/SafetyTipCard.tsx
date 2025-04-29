import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  MapPin, 
  Sun, 
  Bus, 
  Bell, 
  Eye, 
  Brain, 
  Phone, 
  Shield 
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { SafetyTip } from '@/types';

interface SafetyTipCardProps {
  tip: SafetyTip;
}

export const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ tip }) => {
  const getIcon = () => {
    switch (tip.icon) {
      case 'map-pin':
        return <MapPin size={24} color={colors.primary} />;
      case 'sun':
        return <Sun size={24} color={colors.warning} />;
      case 'bus':
        return <Bus size={24} color={colors.secondary} />;
      case 'bell':
        return <Bell size={24} color={colors.danger} />;
      case 'eye':
        return <Eye size={24} color={colors.info} />;
      case 'brain':
        return <Brain size={24} color={colors.secondary} />;
      case 'phone':
        return <Phone size={24} color={colors.primary} />;
      case 'shield':
        return <Shield size={24} color={colors.success} />;
      default:
        return <Bell size={24} color={colors.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.description}>{tip.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});