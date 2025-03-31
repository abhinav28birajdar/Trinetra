import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PADDING_HORIZONTAL = 20;
const CONTENT_AREA_PADDING = 25; // Slightly more padding for form

// --- Colors ---
const COLORS = {
    primaryBackground: '#2A5868',
    contentBackground: '#4F707B',
    cream: '#F5F1E6',
    textLight: '#FDFEFE',
    textDark: '#34495E',
    textDarkMuted: '#5D6D7E',
    white: '#FFFFFF',
    placeholderText: '#95A5A6',
    updateButton: '#3498DB', // Blue button
    shadowColor: '#000',
};

// Placeholder avatar - replace with actual image loading if needed
const userAvatarPlaceholder = require('../assets/images/icon.png');

export default function ProfileScreen() {
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [fatherMobile, setFatherMobile] = useState('');
    const [motherMobile, setMotherMobile] = useState('');
    const [age, setAge] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');

    const handleUpdate = () => {
        console.log("Updating Profile:", {
            fullName, address, mobileNo, fatherMobile, motherMobile, age, bloodGroup
        });
        alert("Profile Update Submitted (Not Implemented)");
    };

    return (
        <View style={styles.screenContainer}>
             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentArea}>
                     {/* Avatar Placeholder */}
                    <View style={styles.avatarContainer}>
                         {/* Replace with actual Image component if loading user image */}
                        <View style={styles.avatarPlaceholder} />
                         {/* <Image source={userAvatarPlaceholder} style={styles.avatarImage} /> */}
                    </View>
                    <Text style={styles.username}>user name</Text>

                     {/* Form Fields */}
                     <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={COLORS.placeholderText}
                        value={fullName}
                        onChangeText={setFullName}
                        />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor={COLORS.placeholderText}
                        value={address}
                        onChangeText={setAddress}
                        multiline // Allow multiple lines for address
                        />
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile No."
                        placeholderTextColor={COLORS.placeholderText}
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        keyboardType="phone-pad"
                        />

                    {/* Inline Fields */}
                    <View style={styles.inlineInputRow}>
                         <TextInput
                            style={[styles.input, styles.inlineInput]}
                            placeholder="Father Mobile No."
                            placeholderTextColor={COLORS.placeholderText}
                            value={fatherMobile}
                            onChangeText={setFatherMobile}
                            keyboardType="phone-pad"
                            />
                         <TextInput
                            style={[styles.input, styles.inlineInput]}
                            placeholder="Mother Mobile No."
                            placeholderTextColor={COLORS.placeholderText}
                            value={motherMobile}
                            onChangeText={setMotherMobile}
                            keyboardType="phone-pad"
                            />
                    </View>

                    {/* Smaller Buttons Row */}
                     <View style={styles.inlineInputRow}>
                         <TextInput
                            style={[styles.input, styles.inlineInputSmall]}
                            placeholder="Age"
                            placeholderTextColor={COLORS.placeholderText}
                            value={age}
                            onChangeText={setAge}
                            keyboardType="number-pad"
                            />
                         <TextInput
                            style={[styles.input, styles.inlineInputSmall]}
                            placeholder="Blood G."
                            placeholderTextColor={COLORS.placeholderText}
                            value={bloodGroup}
                            onChangeText={setBloodGroup}
                            />
                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
             </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 10,
    },
    scrollContent: {
        paddingBottom: 40, // Ensure space at bottom when scrolling
    },
    contentArea: {
        flex: 1,
        backgroundColor: COLORS.contentBackground,
        borderRadius: 30,
        padding: CONTENT_AREA_PADDING,
        alignItems: 'center', // Center avatar and username
    },
    avatarContainer: {
        marginBottom: 10,
        // Add shadow to avatar placeholder
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5, // Needed for Android shadow
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.cream, // Or a light gray
    },
    // avatarImage: { // If using an actual image
    //     width: 120,
    //     height: 120,
    //     borderRadius: 60,
    // },
    username: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 30, // Space below username
    },
    input: {
        backgroundColor: COLORS.cream,
        borderRadius: 15, // Less rounded than search bar
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        color: COLORS.textDark,
        width: '100%', // Take full width within contentArea padding
        marginBottom: 18, // Space between inputs
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inlineInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 18,
    },
    inlineInput: {
        width: '48%', // Two inputs side-by-side with small gap
        marginBottom: 0, // Remove bottom margin as row handles spacing
    },
     inlineInputSmall: {
        width: '30%', // Adjust width for three items
        marginBottom: 0,
        marginRight: '5%', // Add right margin for spacing
    },
    updateButton: {
        backgroundColor: COLORS.updateButton,
        paddingVertical: 15,
        paddingHorizontal: 20, // Adjust padding as needed
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
         width: '30%', // Adjust width
        height: 55, // Match input height approx
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    updateButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});