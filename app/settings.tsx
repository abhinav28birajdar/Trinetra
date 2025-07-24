import React from 'react';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181b' }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
      <Text style={{ color: 'white', marginTop: 8 }}>This is the settings screen.</Text>
    </View>
  );
}
