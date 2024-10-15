import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';

const ScanQR = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!hasPermission) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={() => Camera.requestCameraPermissionsAsync()} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setType(current => 
            current === Camera.Constants.Type.back 
                ? Camera.Constants.Type.front 
                : Camera.Constants.Type.back
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type}>
                <View style={styles.overlay}>
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle} />
                    </View>
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    rectangle: {
        width: '80%',
        height: '30%',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'transparent',
    },
});


export default ScanQR;