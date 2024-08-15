import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);  // Show loading while checking session
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
            <View>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.header}>Loading...</Text>
                        <ActivityIndicator size="large" />
                    </View>
                ) : session ? (
                    <View>
                        <Text style={styles.header}>Welcome</Text>
                        <Text style={styles.subheader}>Enter your pin to access your GOV ID</Text>
                        <ActivityIndicator size='large'/>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.email} value={email} onChangeText={setEmail} />

                        <Text>Password</Text>
                        <TextInput style={styles.email} value={password} onChangeText={setPassword} secureTextEntry />

                        <Button style={styles.button} title="Sign In" onPress={signIn} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        textAlign: 'center'
    },
    email: {
        borderColor: 'black',
        borderWidth: 2,
        margin: 10,
        padding: 10,
        width: '90%'
    },
    label: {
        marginLeft: '50'
    },
    button: {
        width: 100,
        marginLeft: 50,
        border: '2px black solid',
        borderRadius: '5px',
        backgroundColor: "black"
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        padding: 20,
        fontWeight: '600',
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
