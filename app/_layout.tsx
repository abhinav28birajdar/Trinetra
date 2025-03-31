import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Slot, Link, usePathname } from 'expo-router'; // Import Link and usePathname
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

// --- Constants & Assets ---
const PADDING_HORIZONTAL = 20;
const userAvatar = require('../assets/images/icon.png'); // <--- UPDATE PATH/FILENAME if needed

// --- Colors (Keep consistent) ---
const COLORS = {
    primaryBackground: '#2A5868',
    contentBackground: '#4F707B',
    cream: '#F5F1E6',
    lightPink: '#FDECEA',
    darkRed: '#B03A2E',
    white: '#FFFFFF',
    black: '#000000',
    textLight: '#FDFEFE',
    textDark: '#34495E',
    textDarkMuted: '#5D6D7E',
    textMuted: '#888888',
    iconRed: '#E74C3C',
    shadowColor: '#000',
    activeBlue: '#3498DB', // Color for active tab icon (optional)
};

// --- Root Layout Component ---
export default function RootLayout() {
    const pathname = usePathname(); // Get current route path

    // Helper function to determine if a nav item is active
    const isActive = (href: string) => pathname === href;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryBackground} />
            <View style={styles.layoutContainer}>

                {/* --- Top Bar (Consistent) --- */}
                <View style={styles.topBar}>
                    <View style={styles.userInfo}>
                        <Image source={userAvatar} style={styles.avatar} />
                        <Text style={styles.userName}>User..</Text>
                    </View>
                    {/* Settings could link to profile or a dedicated settings page */}
                    <Link href="/profile" asChild>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Feather name="settings" size={22} color="#444" />
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* --- Screen Content Area --- */}
                {/* Slot renders the content of the current matching route file */}
                <View style={styles.contentSlot}>
                    <Slot />
                </View>


                {/* --- Bottom Navigation Area (Consistent) --- */}
                <View style={styles.bottomNavArea}>
                    <View style={styles.bottomNav}>
                        {/* Home Link */}
                        <Link href="/" asChild>
                            <TouchableOpacity style={styles.navItem}>
                                <Ionicons name={isActive('/') ? "home" : "home-outline"} size={28} color={isActive('/') ? COLORS.activeBlue : COLORS.textDarkMuted} />
                            </TouchableOpacity>
                        </Link>
                        {/* Location Link (mapped from Send icon) */}
                        <Link href="/location" asChild>
                            <TouchableOpacity style={styles.navItem}>
                                <Ionicons name={isActive('/location') ? "send" : "send-outline"} size={26} color={isActive('/location') ? COLORS.activeBlue : COLORS.textDarkMuted} style={styles.sendIcon} />
                            </TouchableOpacity>
                        </Link>
                        {/* Spacer for the SOS button */}
                        <View style={[styles.navItem, { flex: 1.4 }]} />
                        {/* Contacts Link (mapped from Groups icon) */}
                        <Link href="/contacts" asChild>
                            <TouchableOpacity style={styles.navItem}>
                                <MaterialIcons name={isActive('/contacts') ? "groups" : "groups"} size={30} color={isActive('/contacts') ? COLORS.activeBlue : COLORS.textDarkMuted} />
                            </TouchableOpacity>
                        </Link>
                        {/* Profile Link */}
                        <Link href="/profile" asChild>
                            <TouchableOpacity style={styles.navItem}>
                                <Ionicons name={isActive('/profile') ? "person" : "person-outline"} size={28} color={isActive('/profile') ? COLORS.activeBlue : COLORS.textDarkMuted} />
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* SOS Button (Overlapping) - Links to QuickCall */}
                    <Link href="/quickcall" asChild>
                         <TouchableOpacity style={styles.sosButton}>
                            <Text style={styles.sosText}>SOS</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}


// --- Styles (Mostly consistent elements) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.primaryBackground,
    },
    layoutContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBackground,
        // No horizontal padding here, apply it within screens if needed or keep consistent
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: Platform.OS === 'android' ? 15 : 10,
        paddingBottom: 10, // Add some space below top bar
        // Removed marginBottom, let contentSlot handle spacing
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    userName: {
        color: COLORS.textLight,
        fontSize: 18,
        fontWeight: '500',
    },
    settingsButton: {
        backgroundColor: COLORS.white,
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },
    contentSlot: {
        flex: 1, // Takes up remaining space between top and bottom bars
        // Screens inside Slot should handle their own internal padding/scrolling
    },
    // --- Bottom Navigation Styles (Copied from previous refinement) ---
    bottomNavArea: {
        position: 'absolute', // Stays at the bottom
        bottom: 0,
        left: 0,
        right: 0,
        height: 95,
        alignItems: 'center',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 20,
        left: PADDING_HORIZONTAL,
        right: PADDING_HORIZONTAL,
        flexDirection: 'row',
        height: 65,
        backgroundColor: COLORS.cream,
        borderRadius: 32.5,
        alignItems: 'center',
        paddingHorizontal: 15,
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    sendIcon: {
        transform: [{ rotate: '-30deg' }],
        marginTop: -2,
        marginLeft: -3,
    },
    sosButton: {
        position: 'absolute',
        bottom: 35,
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: COLORS.darkRed,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 12,
        borderWidth: 3,
        borderColor: COLORS.cream,
    },
    sosText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});