import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const PADDING_HORIZONTAL = 20;
const CONTENT_AREA_PADDING = 20;

// --- Colors ---
const COLORS = {
    primaryBackground: '#2A5868',
    contentBackground: '#4F707B',
    cream: '#F5F1E6',
    textLight: '#FDFEFE',
    sosGradientStart: '#FFD700', // Gold/Yellow
    sosGradientEnd: '#FF8C00',   // Dark Orange/Reddish
    sosTextShadow: 'rgba(0,0,0,0.5)',
    white: '#FFFFFF',
};

export default function QuickCallScreen() {
    const handleSosPress = () => {
        // Add actual SOS call/alert logic here
        console.log("SOS Button Pressed!");
        alert("SOS Activated!"); // Placeholder alert
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentArea}>
                <Text style={styles.title}>Quick Call</Text>
                <View style={styles.sosButtonContainer}>
                    <TouchableOpacity onPress={handleSosPress} activeOpacity={0.8}>
                        <LinearGradient
                            // Button Linear Gradient
                            colors={[COLORS.sosGradientStart, COLORS.sosGradientEnd]}
                            style={styles.sosButtonGradient}
                            start={{ x: 0, y: 0 }} // Gradient direction
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.sosInnerCircle}>
                                <Text style={styles.sosTextLarge}>SOS</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
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
        padding: CONTENT_AREA_PADDING,
        alignItems: 'center', // Center content horizontally
        justifyContent: 'flex-start', // Align items to top
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: 10, // Space from top of card
        marginBottom: 40, // Space above button
    },
    sosButtonContainer: {
        // Container helps with centering and potential spacing
        flex: 1,
        justifyContent: 'center', // Center button vertically in remaining space
        alignItems: 'center',
    },
    sosButtonGradient: {
        width: 220, // Large button size
        height: 220,
        borderRadius: 110, // Circular
        justifyContent: 'center',
        alignItems: 'center',
        // Outer shadow for the button
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    sosInnerCircle: {
        width: '90%', // Slightly smaller inner circle look
        height: '90%',
        borderRadius: 100, // Adjust to match inner size
        backgroundColor: COLORS.cream, // Inner background color
        justifyContent: 'center',
        alignItems: 'center',
        // Inner shadow/inset effect (subtle)
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5, // Inner elevation
    },
    sosTextLarge: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#B03A2E', // Match the outer SOS button color
        // Text shadow for depth
        textShadowColor: COLORS.sosTextShadow,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        letterSpacing: 2,
    },
});