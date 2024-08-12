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
            const storedSession = await AsyncStorage.getItem('session');
            if (storedSession) {
                const user = JSON.parse(storedSession);
                setSession(user);

                // Bug fix: Verify session with Supabase
                try {
                    const { data: userSnapshot, error } = await supabase.auth.getUser();
                    if (error || !userSnapshot) {
                        throw error;
                    }
                    navigateToPin(user.id);
                } catch (error) {
                    console.error("Session verification failed: ", error);
                    await AsyncStorage.removeItem('session');
                    navigation.navigate('Login'); // Redirect to refresh session
                    setLoading(false);
                }
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

            // Verify user existence
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
        setTimeout(() => {
            navigation.navigate('Pin', { userKey: userId });
        }, 1500);
    };

    return (
        <SafeAreaView>
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
                    <SafeAreaView>
                        <Text>Email</Text>
                        <TextInput style={styles.email} value={email} onChangeText={setEmail} />

                        <Text>Password</Text>
                        <TextInput style={styles.email} value={password} onChangeText={setPassword} secureTextEntry />

                        <Button style={styles.button} title="Sign In" onPress={signIn} />
                    </SafeAreaView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    email: {
        borderColor: 'black',
        borderWidth: 2,
        margin: 10,
        padding: 10,
    },
    button: {
        width: 100,
        marginLeft: 50
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
