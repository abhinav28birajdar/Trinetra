import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'; // Import Region type
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const CONTENT_AREA_PADDING = 20;

// --- Colors ---
const COLORS = {
    primaryBackground: '#2A5868',
    contentBackground: '#4F707B',
    cream: '#F5F1E6',
    textLight: '#FDFEFE',
    textDark: '#34495E',
    shadowColor: '#000',
};

export default function LocationScreen() {
    // Use the correct Region type from react-native-maps
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsLoading(false);
                Alert.alert('Permission Denied', 'Please enable location permissions in your settings to use this feature.');
                return;
            }

            try {
                // Get location with higher accuracy - might take longer
                let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setMapRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01, // Zoom level
                    longitudeDelta: 0.01, // Zoom level
                });
            } catch (error) {
                setErrorMsg('Could not fetch location.');
                console.error("Location Error:", error);
                Alert.alert('Location Error', 'Could not fetch your current location.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentArea}>
                <Text style={styles.title}>Live Location</Text>
                <View style={styles.mapContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={COLORS.cream} style={styles.loadingIndicator} />
                    ) : errorMsg || !mapRegion ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMsg || 'Could not load map region.'}</Text>
                        </View>
                    ) : (
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={mapRegion}
                            region={mapRegion}
                            showsUserLocation={true}
                            followsUserLocation={true}
                        >
                            <Marker
                                coordinate={{ 
                                    latitude: mapRegion.latitude, 
                                    longitude: mapRegion.longitude 
                                }}
                                title={"Your Location"}
                            />
                        </MapView>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 10, // Space below top bar
    },
    contentArea: {
        flex: 1, // Take remaining height
        backgroundColor: COLORS.contentBackground,
        borderRadius: 30,
        padding: CONTENT_AREA_PADDING,
        overflow: 'hidden', // Clip map corners
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 15,
    },
    mapContainer: {
        flex: 1,
        borderRadius: 20, // Apply rounding to the map container itself
        overflow: 'hidden', // Ensure map respects the border radius
        backgroundColor: '#555', // Background while loading/error
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Make map fill its container
    },
    loadingIndicator: {
        // Positioned center by mapContainer styles
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.cream,
        fontSize: 16,
        textAlign: 'center',
    }
});