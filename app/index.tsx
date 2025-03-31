import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

// --- Constants & Assets ---
const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20; // Match layout padding
const CONTENT_AREA_PADDING_VERTICAL = 25;
const CONTENT_AREA_PADDING_HORIZONTAL = 20;
const CAROUSEL_IMAGE_WIDTH = width - PADDING_HORIZONTAL * 2 - CONTENT_AREA_PADDING_HORIZONTAL * 2;
const carouselImages = [
    require('../assets/images1.jpeg'), // <--- UPDATE PATH/FILENAME
    require('../assets/images1.jpeg'),
    require('../assets/images1.jpeg'),
];

// --- Colors (Can reuse from layout or define locally) ---
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
};

// --- Home Screen Component ---
export default function IndexScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.floor(scrollPosition / CAROUSEL_IMAGE_WIDTH + 0.5);
        if (index !== activeIndex && index >= 0 && index < carouselImages.length) {
            setActiveIndex(index);
        }
    };

    return (
        // Main container for this screen's content
        <View style={styles.screenContainer}>
            {/* --- Search Bar --- */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    placeholder="search.."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
            </View>

            {/* --- Scrollable Content Area --- */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mainScrollContent}
            >
                <View style={styles.contentArea}>
                    {/* --- Large Icons Row --- */}
                    <View style={styles.largeIconRow}>
                        <TouchableOpacity style={[styles.largeIconButton, styles.phoneButton]}>
                            <Feather name="phone" size={48} color={COLORS.iconRed} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.largeIconButton, styles.groupButton]}>
                            <View style={styles.groupIconWrapper}>
                                <MaterialIcons name="groups" size={45} color={COLORS.white} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* --- Small Circles Row --- */}
                    <View style={styles.smallIconRow}>
                        <TouchableOpacity style={styles.smallIconButton}>
                            <Text style={styles.smallIconNumber}>100</Text>
                            <Text style={styles.smallIconText}>Police</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallIconButton}>
                            <Text style={styles.smallIconNumber}>1800</Text>
                            <Text style={styles.smallIconText}>Ambulance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallIconButton}>
                            <Ionicons name="location-outline" size={26} color={COLORS.textDark} />
                            <Text style={styles.smallIconText}>Location</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- Image Carousel --- */}
                    <View style={styles.carouselContainer}>
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            style={styles.imageScrollView}
                            snapToInterval={CAROUSEL_IMAGE_WIDTH}
                            decelerationRate="fast"
                        >
                            {carouselImages.map((source, index) => (
                                <Image key={index} source={source} style={styles.carouselImage} resizeMode="cover" />
                            ))}
                        </ScrollView>
                        <View style={styles.pagination}>
                            {carouselImages.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        activeIndex === index ? styles.activeDot : styles.inactiveDot,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// --- Styles (Specific to Index Screen Content) ---
// Many styles are copied/adapted from the previous refinement
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL, // Add padding for content within this screen
        // Background color is inherited from layout
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cream,
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginTop: 10, // Space below top bar
        marginBottom: 25, // Space above scroll content
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
        paddingVertical: 0,
    },
    mainScrollContent: {
       paddingBottom: 20, // Padding at the very bottom of scrollable content
    },
    contentArea: {
        backgroundColor: COLORS.contentBackground,
        borderRadius: 30,
        paddingHorizontal: CONTENT_AREA_PADDING_HORIZONTAL,
        paddingVertical: CONTENT_AREA_PADDING_VERTICAL,
    },
    largeIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    largeIconButton: {
        width: 110,
        height: 110,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    phoneButton: {
        backgroundColor: COLORS.lightPink,
    },
    groupButton: {
        backgroundColor: COLORS.cream,
    },
    groupIconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 35,
    },
    smallIconButton: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: COLORS.cream,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        shadowColor: COLORS.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    smallIconNumber: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    smallIconText: {
        fontSize: 12,
        color: COLORS.textDarkMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    carouselContainer: {
        height: 190,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    imageScrollView: {},
    carouselImage: {
        width: CAROUSEL_IMAGE_WIDTH,
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 12,
        alignSelf: 'center',
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
});