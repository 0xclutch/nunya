import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import QRCode from 'react-native-qrcode-svg'; // Ensure QRCode is displayed
import CustomHeaderShare from '../CustomHeaderShare';

const FakeShareID = () => {
  const [qrValue, setQRValue] = useState('https://www.youtube.com/watch?v=xvFZjo5PgG0');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("");
  const [user, setUser] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    console.log("FakeShareID screen - fetching db info for user data");
    fetchUserData();
    generateLicenseNum();
  }, []);

  const generateLicenseNum = async () => {
    const storedLicenseNum = await AsyncStorage.getItem('licenseNum');

    if (storedLicenseNum) {
      setLicenseNum(formatLicenseNum(storedLicenseNum));
      console.log("License number already exists:", storedLicenseNum);
    } else {
      let license_num = '';
      for (let i = 0; i < 9; i++) {
        license_num += Math.floor(Math.random() * 10).toString();
      }

      await AsyncStorage.setItem('licenseNum', license_num);
      setLicenseNum(formatLicenseNum(license_num));
      console.log("New license number generated:", license_num);
    }
  };

  const formatLicenseNum = (licenseNum) => {
    // Insert spaces after every 3 characters
    return licenseNum.match(/.{1,3}/g).join(' ');
  };

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
          console.error('[SERVER] Error fetching user data:', error);
          alert("Error: Could not display profile. Please try again later.");
          navigation.navigate('Share');
        } else {
          console.log('User data:', data);
          setProfilePicture(data.photo || "");
          setUser(data);
        }
      } else {
        console.error("No session found");
        navigation.navigate('Share');
      }
    } catch (error) {
      console.error('[SERVER] Error fetching user data:', error);
      navigation.navigate('Share');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Show this QR Code to share your details</Text>
        {profilePicture ? (
          <Image style={styles.profilePicture} source={{ uri: profilePicture }} />
        ) : (
          <Text>No profile picture available</Text>
        )}
        <Text style={styles.licenseNumber}>{licenseNum}</Text>
        <QRCode value={qrValue} size={150} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    fontFamily: 'Arial',
  },
  header: {
    alignItems: 'center',
    padding: 20, // Adjust padding to add space around content
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePicture: {
    width: 90,
    height: 120,
    borderRadius: 5,
    marginBottom: 20,
  },
  licenseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default FakeShareID;
