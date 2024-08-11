import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://mkzrsppxtzvdfmraueiv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1renJzcHB4dHp2ZGZtcmF1ZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMzNzcyNDMsImV4cCI6MjAzODk1MzI0M30.jCheBzxYFXUS63z-ISo9MXgxFosrXdu8LPobRFyUNro')

const PinScreen = () => {
    const [pin, setPin] = useState('');
    const rnBiometrics = new ReactNativeBiometrics();


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
            .eq('pin', holdTemp)
        
        if(error) {
            Alert.alert("Incorrect Pin");
        } else {
            Alert.alert("Correct Pin", data);
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
