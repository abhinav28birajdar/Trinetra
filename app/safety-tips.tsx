import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafetyTipCard } from '@/components/SafetyTipCard';
import { colors } from '@/constants/Colors';
import { safetyTips } from '@/constants/safety-tips';
import { SafetyTip } from '@/types';

export default function SafetyTipsScreen() {
  const renderTip = ({ item }: { item: SafetyTip }) => (
    <SafetyTipCard tip={item} />
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={safetyTips}
        keyExtractor={(item) => item.id}
        renderItem={renderTip}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Daily Safety Tips</Text>
            <Text style={styles.subtitle}>Stay aware. Stay safe.</Text>
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