import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; // Using Feather for phone icon

const PADDING_HORIZONTAL = 20;
const CONTENT_AREA_PADDING = 20;

// --- Colors ---
const COLORS = {
    primaryBackground: '#2A5868',
    contentBackground: '#4F707B',
    cream: '#F5F1E6',
    textLight: '#FDFEFE',
    textDark: '#34495E',
    textDarkMuted: '#5D6D7E',
    white: '#FFFFFF',
    iconBlue: '#3498DB', // Color for the floating action button
    shadowColor: '#000',
};

// --- Mock Data ---
const mockContacts = [
    { id: '1', name: 'Person 1' },
    { id: '2', name: 'Person 2' },
    { id: '3', name: 'Person 3' },
    { id: '4', name: 'Person 4' },
    { id: '5', name: 'Person 5' },
    { id: '6', name: 'Person 6' },
];

export default function ContactsScreen() {

    const handleCallPress = (contactName: string) => {
        console.log(`Calling ${contactName}...`);
        alert(`Calling ${contactName}... (Implement actual call)`);
    };

     const handleAddContact = () => {
        console.log("Add new contact...");
        alert("Navigate to Add Contact screen (Not Implemented)");
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentArea}>
                <Text style={styles.title}>Contact List</Text>
                <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {mockContacts.map((contact) => (
                        <TouchableOpacity key={contact.id} style={styles.contactItem} activeOpacity={0.7} onPress={() => handleCallPress(contact.name)}>
                            <View style={styles.contactInfo}>
                                <Ionicons name="person-circle-outline" size={36} color={COLORS.cream} style={styles.contactIcon} />
                                <Text style={styles.contactName}>{contact.name}</Text>
                            </View>
                            <Feather name="phone-call" size={24} color={COLORS.cream} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                 {/* Floating Add Button */}
                 <TouchableOpacity style={styles.addButton} onPress={handleAddContact} activeOpacity={0.8}>
                    <Ionicons name="add" size={35} color={COLORS.white} />
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 10,
    },
    contentArea: {
        flex: 1,
        backgroundColor: COLORS.contentBackground,
        borderRadius: 30,
        paddingTop: CONTENT_AREA_PADDING, // Padding top inside card
        paddingBottom: 10, // Less padding bottom to allow FAB visibility
        paddingHorizontal: CONTENT_AREA_PADDING,
        position: 'relative', // Needed for absolute positioning of FAB
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        flex: 1, // Allows list to scroll if content overflows
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(245, 241, 230, 0.2)', // Faint cream border
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactIcon: {
        marginRight: 15,
    },
    contactName: {
        fontSize: 18,
        color: COLORS.textLight,
    },
    addButton: {
        position: 'absolute',
        bottom: 25, // Position from bottom of contentArea
        right: 25,  // Position from right of contentArea
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.iconBlue, // Blue color like image
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});