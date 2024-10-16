import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);


      

    const checkSession = useCallback(async () => {
        setLoading(true);
        try {
            const storedSession = await AsyncStorage.getItem('session');
            if (storedSession) {
                const user = JSON.parse(storedSession);
                setSession(user);

                const { data: userSnapshot, error } = await supabase.auth.getUser();
                if (error || !userSnapshot) {
                    throw new Error('AuthSessionMissingError');
                }
                if (userSnapshot) {
                    navigateToPin(user.id);
                }
            } else {
                navigateBackToLogin();
            }
        } catch (error) {
            console.log("[Server] @ ./Login - Session verification failed: ", error);
            await AsyncStorage.removeItem('session');
            navigateBackToLogin();
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    const signIn = useCallback(async () => {
        setLoading(true);
        try {
            const { data: userCredential, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            const user = userCredential.user;
            setSession(user);
            await AsyncStorage.setItem('session', JSON.stringify(user));

            const { data: userSnapshot, error: fetchError } = await supabase.auth.getUser();
            if (fetchError || !userSnapshot) {
                throw fetchError;
            }
            navigateToPin(user.id);
        } catch (error) {
            Alert.alert('Login Failed', error.message);
            console.error('Login error:', error.message);
        } finally {
            setLoading(false);
        }
    }, [email, password, navigation]);

    const navigateToPin = useCallback((userId) => {
        navigation.navigate('Pin', { userKey: userId });
    }, [navigation]);

    const navigateBackToLogin = useCallback(() => {
        navigation.navigate('Login');
        setSession(null);
    }, [navigation]);

    // Prevent scrolling outside of the container (iOS safari fix)
    // document.addEventListener('touchmove', function(event) {
    //     if (!event.target.closest('.container')) {
    //         event.preventDefault();
    //     }
    //     }, { passive: false });


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.header}>Loading...</Text>
                        <ActivityIndicator size="large" color="#6200EE" />
                    </View>
                ) : session ? (
                    <View>
                        <Text style={styles.header}>Welcome</Text>
                        <Text style={styles.subheader}>Enter your pin to access your GOV ID</Text>
                        <ActivityIndicator size="large" color="#6200EE" />
                    </View>
                ) : (
                    <View>
                        <Text style={styles.header}>Login</Text>
                        <Text style={styles.label}>Email</Text>
                        <TextInput 
                            style={styles.input} 
                            value={email} 
                            onChangeText={setEmail} 
                            placeholder="Enter your email" 
                            keyboardType="email-address" 
                            autoCapitalize="none"
                        />
                        
                        <View style={styles.gap} />

                        <Text style={styles.label}>Password</Text>
                        <TextInput 
                            style={styles.input} 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry 
                            placeholder="Enter your password" 
                        />

                        <TouchableOpacity style={styles.button} onPress={signIn}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>

                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Light gray background
    },
    innerContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6, // For Android shadow
    },
    input: {
        borderColor: '#CCCCCC', // Soft gray border
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginVertical: 12,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FAFAFA', // Light background for inputs
    },
    label: {
        fontWeight: '600',
        fontSize: 16,
        color: '#444444',
        marginBottom: 6,
    },
    gap: {
        height: 20,
    },
    button: {
        backgroundColor: '#007BFF', // Modern blue color
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5, // Shadow effect for Android
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    disclaimer: {
        marginTop: 20,
        textAlign: 'center',
        color: '#888888',
        fontSize: 12,
        lineHeight: 18,
    },
    header: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 25,
        color: '#333333',
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#555555',
        lineHeight: 22,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});