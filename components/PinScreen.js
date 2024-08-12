import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

import { supabase } from './supabaseClient';

import { createClient } from '@supabase/supabase-js'

const PinScreen = ({ route, navigation }) => {
    const [pin, setPin] = useState('');
    const { userKey } = route.params;  // Access the passed argument


    // constantly listen if the pin.lenght is > 6
    useEffect(() => {
        if (pin.length > 6) {
            return;
        } else if(pin.length == 6) {
            attemptLogin();
        }
    }, [pin]);

    const handleInput = (num) => {
        if (pin.length < 6) {
          setPin(pin + num);
        } 
    };

    const attemptLogin = async () => {
        const holdTemp = pin;

        const { data, error } = await supabase
            .from('users')
            .select('pin')
            .eq('uuid', userKey)
            .single()
          
        if (error || !data) {
          Alert.alert("Error fetching PIN", error.message);
          console.log("ERROR FETCHING!", error.message);
          setPin("");  // Reset PIN input
          return;
        }
  
        const savedPin = data.pin;  // Get the saved PIN from the fetched data
  
        // Check if the entered PIN matches the saved PIN
        if (holdTemp === savedPin) {
          Alert.alert("Correct Pin");
          console.log("CORRECT! ", data.pin)
          // Navigate to the next screen or do something else
          navigation.navigate('HomePage');  // Replace 'NextScreen' with your actual screen name
        } else {
          Alert.alert("Incorrect Pin");
          setPin("");  // Reset PIN input
        }

        setPin("");
    }


    const deleteLast = () => {
        setPin(pin.substring(0, pin.length - 1));
    };



    // Custom keypad order
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0];

    return (
        <View style={styles.container}>
        <View style={styles.pinInputContainer}>
            <Text style={styles.pinInput}>{pin.padEnd(6, '•')}</Text>
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
  },
  pinInput: {
    fontSize: 30,
    letterSpacing: 10,
  },
  resetButton: {
    color: 'red',
    marginBottom: 20,
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
});

export default PinScreen;
