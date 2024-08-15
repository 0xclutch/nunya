import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            const storedSession = await AsyncStorage.getItem('session');
            if (storedSession) {
                const user = JSON.parse(storedSession);
                setSession(user);

                try {
                    const { data: userSnapshot, error } = await supabase.auth.getUser();
                    if (error || !userSnapshot) {
                        throw new Error('AuthSessionMissingError');
                    }
                    if (userSnapshot) {
                        navigateToPin(user.id);
                    }
                } catch (error) {
                    console.log("Session verification failed: ", error);
                    await AsyncStorage.removeItem('session');
                    navigateBackToLogin();
                } finally {
                    setLoading(false);
                }
            } else {
                navigateBackToLogin();
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signIn = async () => {
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
    };

    const navigateToPin = (userId) => {
        navigation.navigate('Pin', { userKey: userId });
    };

    const navigateBackToLogin = () => {
        navigation.navigate('Login');
        setSession(null);
    }

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

                        <Text style={styles.disclaimer}>
                            Input your received account details. Warning: There may be delays in fetching your login details, so it's YOUR RESPONSIBILITY to memorize and look after your credentials.
                        </Text>
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
        backgroundColor: '#F0F0F0',
    },
    innerContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        borderColor: '#6200EE',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
        color: '#333333',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333333',
    },
    gap: {
        height: 20,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        marginTop: 20,
        textAlign: 'center',
        color: '#888888',
        fontSize: 12,
    },
    header: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6200EE',
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
