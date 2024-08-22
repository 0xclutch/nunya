import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text } from 'react-native';

const FakeShareID = () => {
    const [qrValue, setQRValue] = useState('https://www.youtube.com/watch?v=xvFZjo5PgG0'); 
    const navigation = useNavigation();
    const generateQRCode = () => { 
        if (!qrValue) return; 

        setIsActive(true); 
    }; 

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
          const storedSession = await AsyncStorage.getItem('session');
          
          if (storedSession) {
            const sessionObj = JSON.parse(storedSession);
            setSession(sessionObj);
    
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('uuid', sessionObj.id)
              .single();
    
            if (error) {
              console.log('[SERVER] !!Error!! fetching user data:', error);
              Alert.alert("Error", "Something went wrong when trying to display your profile.\nPlease try again at another time... [Details] " + error );
              navigation.navigate('Share');
            } else {
              console.log('User data:', data);
              setProfilePicture(data.photo || "");
              setUser(data);
            }
          } else {
            setUser(null);
            console.error("Couldn't get session");
            Alert.alert("Error", "Something went wrong when trying to display your profile.\nPlease try again at another time... [Details] " + error);
            navigation.navigate('Share');
          }
        } catch (error) {
          console.log('[SERVER! HEY!] !!ERROR!! Error fetching user data:', error);
          Alert.alert("Error", "Something went wrong when trying to display your profile.\nPlease try again at another time... [Details] " + error);
          navigation.navigate('Share');
        } finally {
          setLoading(false);
        }
      };

    return (
        <SafeAreaView>
            <Text>Welp... You got caught! d: </Text>
        </SafeAreaView>
    );
}

export default FakeShareID;