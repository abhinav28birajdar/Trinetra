import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
} from 'react-native';
import { Home, MapPin, Users, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import SOSButton from './SOSButton';

const { width } = Dimensions.get('window');

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const router = useRouter();

  const handleSOSPress = () => {
    router.push('/sos');
  };

  const renderIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? Colors.primary : Colors.textLight;
    
    switch (routeName) {
      case 'home':
        return <Home size={24} color={color} />;
      case 'location':
        return <MapPin size={24} color={color} />;
      case 'community':
        return <Users size={24} color={color} />;
      case 'profile':
        return <User size={24} color={color} />;
      default:
        return <Home size={24} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            {renderIcon(route.name, isFocused)}
          </TouchableOpacity>
        );
      })}
      <View style={styles.sosButtonContainer}>
        <SOSButton onPress={handleSOSPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonContainer: {
    position: 'absolute',
    top: -20,
    left: (width - 70) / 2,
    zIndex: 1,
  },
});

export default TabBar;