import React, { useState } from 'react';  
import { supabase } from './supabaseClient';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login ({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);  // Added loading state

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(true);  // Start loading
        if (error) { 
            Alert.alert(error.message);
            console.error(error.message);
            setLoading(false);  // Start loading
        }
        else {
            setLoading(false);
            setSession(data.session);

            const userId = data.user.id;

            setTimeout(() => {
                console.log(userId);
                navigation.navigate('Pin', { userKey: userId } );
            }, 1500);
        }
    };

    return (
        <View>
        {loading ? (
            // Add loading screen
            <View style={styles.loadingContainer}>
                <Text style={styles.header}>Loading...</Text>
                <ActivityIndicator size="large" />
            </View>
        ) : session ? (
            <View>
                <Text style={styles.header}>Welcome! Enter your pin to access your GOV ID</Text>
                <ActivityIndicator size="large" />
            </View>
        ) : (
            <>
                <SafeAreaView>
                    <Text>Email</Text>
                    <TextInput style={styles.email} value={email} onChangeText={setEmail} /><br></br>

                    <Text>Password</Text>
                    <TextInput style={styles.email} value={password} onChangeText={setPassword} secureTextEntry /><br></br>
                    <Button style={styles.button} title="Sign In" onPress={signIn} />
                </SafeAreaView>
            </>
        )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,    
    },
    email: {
        border: "2px black solid",
        margin: "10px",
        padding: '10px',
    },
    button: {
        width: "10px",
        marginLeft: "50px"
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        padding: '20px',
        fontWeight: "600",
        marginBottom: "30px"
    }
})
