import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { helplines } from "@/constants/helplines";
import { HelplineCard } from "@/components/HelplineCard";
import Colors from "@/constants/colors";

export default function HelplinesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { id: "all", name: "All" },
    { id: "emergency", name: "Emergency" },
    { id: "women", name: "Women" },
    { id: "health", name: "Health" },
    { id: "other", name: "Other" }
  ];
  
  const filteredHelplines = selectedCategory && selectedCategory !== "all"
    ? helplines.filter(helpline => helpline.category === selectedCategory)
    : helplines;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Important helpline numbers for emergencies. Tap on a number to call.
        </Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === item.id && styles.categoryButtonTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <FlatList
        data={filteredHelplines}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HelplineCard helpline={item} />
        )}
        contentContainerStyle={styles.helplinesList}
      />
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
  categoriesContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.gray[100],
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: Colors.white,
  },
  helplinesList: {
    padding: 16,
  }
});