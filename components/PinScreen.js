import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from './supabaseClient';

const PinScreen = ({ route, navigation }) => {
    const [pin, setPin] = useState('');
    const { userKey } = route.params || {}; // Access the passed argument

    useEffect(() => {
        if (pin.length === 6) {
            attemptLogin();
        }
    }, [pin]);

    const handleInput = (num) => {
        if (pin.length < 6) {
            setPin(pin + num);
        }
    };

    const attemptLogin = async () => {
        if (!userKey) {
            Alert.alert("Error", "User key is missing.");
            return;
        }

        const { data, error } = await supabase
            .from('users')
            .select('pin')
            .eq('uuid', userKey)
            .single();

        if (error || !data) {
            Alert.alert("Error fetching PIN", error ? error.message : "User not found.");
            setPin("");  // Reset PIN input
            return;
        }

        const savedPin = data.pin;

        if (pin === savedPin) {
            navigation.navigate('HomePage');  // Navigate to the next screen
        } else {
            Alert.alert("Incorrect Pin");
            setPin("");  // Reset PIN input
        }
    };

    const deleteLast = () => {
        setPin(pin.substring(0, pin.length - 1));
    };

    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Enter your 6 digit PIN</Text>
            </View>
            <View style={styles.pinInputContainer}>
                <Text style={styles.pinInput}>{pin.padEnd(6, '•')}</Text>
                <Text>Forgot your PIN? <Text style={styles.reset}>RESET</Text></Text>
            </View>
            <View style={styles.keypad}>
                {keys.map((key, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.key}
                        onPress={() => handleInput(key.toString())}
                    >
                        <Text style={styles.keyText}>{key}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={styles.key}
                    onPress={deleteLast}
                >
                    <Text style={styles.keyText}>⌫</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    pinInputContainer: {
        marginBottom: 20,
        textAlign: "center"
    },
    pinInput: {
        fontSize: 30,
        letterSpacing: 10,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: 300,
    },
    key: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    keyText: {
        fontSize: 30,
    },
    reset: {
        color: '#a14e61',
        fontWeight: "700",
        letterSpacing: "1.75px"
    },
    title: {
        fontSize: 16,
    }
});

export default PinScreen;
