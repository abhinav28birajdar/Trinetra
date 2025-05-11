import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import { Phone } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { EmergencyService } from '@/types';

interface EmergencyServiceItemProps {
  service: EmergencyService;
  onPress: () => void;
}

const EmergencyServiceItem: React.FC<EmergencyServiceItemProps> = ({
  service,
  onPress,
}) => {
  const getBackgroundColor = () => {
    switch (service.type) {
      case 'police':
        return Colors.primary;
      case 'ambulance':
        return Colors.error;
      case 'fire':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.number}>{service.number}</Text>
      <Text style={styles.name}>{service.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  name: {
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default EmergencyServiceItem;