import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelplineCard } from '@/components/HelplineCard';
import { colors } from '@/constants/Colors';
import { helplines } from '@/constants/helplines';
import { Helpline } from '@/types';

export default function HelplinesScreen() {
  const renderHelpline = ({ item }: { item: Helpline }) => (
    <HelplineCard helpline={item} />
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={helplines}
        keyExtractor={(item) => item.id}
        renderItem={renderHelpline}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Helplines</Text>
            <Text style={styles.subtitle}>
              Important numbers to call during emergencies.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
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
});