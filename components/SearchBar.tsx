import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { useColors } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "search..",
  isDarkMode = false,
}: SearchBarProps) {
  const Colors = useColors();
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDarkMode ? Colors.background.secondary : Colors.background.primary }
    ]}>
      <Search size={20} color="#999" style={styles.icon} />
      <TextInput
        style={[styles.input, { color: Colors.text.dark }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.65,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});