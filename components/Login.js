import React, { useState } from 'react';  
import { supabase } from './supabaseClient';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, TextInput } from 'react-native';

export default function Login ({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) console.error(error.message);
        else setSession(data.session);
    };

    return (
        <View>
        {session ? (
            <Text>Signed in as: {session.user.email}</Text>
        ) : (
            <>
                <Text>Email</Text>
                <TextInput style={styles.email} value={email} onChangeText={setEmail} /><br></br>
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <Button title="Sign In" onPress={signIn} />
            </>
        )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,    
    }
})
