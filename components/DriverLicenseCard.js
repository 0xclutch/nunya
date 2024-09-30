import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DriverLicenseCard = () => {
    const navigation = useNavigation();

    const redirectToShare = () => {
        navigation.navigate('Share');
    }

    return (
        <View style={styles.containeR}>
            <View style={styles.cardContainer}>
                {/* Other elements of the card such as photo, text fields, etc. */}
            </View>
        
        {/* Sticky Share Button */}
            <TouchableOpacity style={styles.button} onPress={redirectToShare}>
                <Text style={styles.buttonText}>SHARE DRIVER'S LICENSE</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'fixed',
        bottom: 20, // Adjust this value to fit your design
        left: 20, // Adjust this value to fit your design
        right: 20, // Adjust this value to fit your design
        backgroundColor: '#f1ae5d', // Blue background
        borderRadius: 5, // Rounded corners
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default DriverLicenseCard;
