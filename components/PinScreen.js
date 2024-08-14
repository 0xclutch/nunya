import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from './supabaseClient';

const PinScreen = ({ route, navigation }) => {
    const [pin, setPin] = useState([]);
    const { userKey } = route.params || {}; // Access the passed argument

    useEffect(() => {
        if (pin.length === 6) {
            attemptLogin();
        }
    }, [pin]);

    const handleInput = (num) => {
        if (pin.length < 6) {
            const newPin = [...pin, { value: num, visible: true }];
            setPin(newPin);

            // Hide the character after 2 seconds
            setTimeout(() => {
                setPin((prevPin) =>
                    prevPin.map((char, index) =>
                        index === newPin.length - 1 ? { ...char, visible: false } : char
                    )
                );
            }, 250);
        }
    };

    const attemptLogin = async () => {
        const enteredPin = pin.map((char) => char.value).join('');

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
            setPin([]);  // Reset PIN input
            return;
        }

        const savedPin = data.pin;

        if (enteredPin === savedPin) {
            navigation.navigate('HomePage');  // Navigate to the next screen
        } else {
            Alert.alert("Incorrect Pin");
            setPin([]);  // Reset PIN input
        }
    };

    const deleteLast = () => {
        setPin(pin.slice(0, -1));
    };

    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.faceIdIcon}>👁‍🗨</Text>
                <Text style={styles.title}>Enter your 6 digit PIN</Text>
            </View>
            <View style={styles.pinInputContainer}>
                <View style={styles.pinDotsContainer}>
                    {[...Array(6)].map((_, index) => (
                        <View key={index} style={styles.pinDot}>
                            <Text style={styles.pinDotText}>
                                {pin[index] ? (pin[index].visible ? pin[index].value : '•') : ''}
                            </Text>
                        </View>
                    ))}
                </View>
                <TouchableOpacity>
                    <Text style={styles.resetText}>Forgot your PIN? <Text style={styles.reset}>RESET</Text></Text>
                </TouchableOpacity>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    faceIdIcon: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        color: '#7B2B7A',
        fontWeight: '500',
        letterSpacing: 1.5,
    },
    pinInputContainer: {
        alignItems: 'center',
        marginBottom: 60,
        width: '100%',
        paddingHorizontal: 50,
    },
    pinDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    pinDot: {
        width: 37,
        height: 43,
        borderWidth: 2,
        borderColor: '#7B2B7A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinDotText: {
        fontSize: 24,
        color: '#7B2B7A',
    },
    resetText: {
        fontSize: 14,
        color: '#7B2B7A',
        letterSpacing: 1.2,
    },
    reset: {
        fontWeight: '700',
    },
    keypad: {
        width: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    key: {
        width: '30%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
    },
    keyText: {
        fontSize: 30,
        color: '#333',
    },
});

export default PinScreen;
