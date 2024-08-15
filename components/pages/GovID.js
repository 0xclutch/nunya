import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, RefreshControl, Animated, Easing, TouchableOpacity, ImageBackground } from 'react-native';
import { supabase } from '../supabaseClient';
import { ActivityIndicator } from 'react-native-web';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install this dependency

const GovID = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const rotation = useState(new Animated.Value(0))[0]; // Rotation animation state
  const scale = useState(new Animated.Value(1))[0]; // Scale animation state
  const qldGovLogo = require('./images/qldgov.png');
  const placeholderImage = require('./images/placeholder.jpg');
  const backgroundImage = require('./images/background.png'); // Add your background image here

  const months = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };

  const fetchUserData = async () => {
    const storedSession = await AsyncStorage.getItem('session');
    
    if (storedSession) {
      const sessionObj = JSON.parse(storedSession);
      setUser(sessionObj);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uuid', sessionObj.id)
        .single();

      if (error) {
        console.log('error', error);
      } else {
        setUser(data);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  const generateLicenseNum = () => {
    let license_num = '';
    for (let i = 0; i < 9; i++) { 
      license_num += Math.floor(Math.random() * 10).toString();
    }
    setLicenseNum(license_num);
  };

  const generateExpiryDate = () => {
    const currentYear = new Date().getFullYear();
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const expiryYear = currentYear + 3;
    const formattedExpiryDate = `${randomDay} ${months[randomMonth]} ${expiryYear}`;
    setExpiryDate(formattedExpiryDate);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotation.setValue(0);
    });
    await fetchUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserData();
    generateLicenseNum();
    generateExpiryDate();
    // Start the bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loading}>Fetching your digital wallet...</Text>
        <ActivityIndicator style={styles.loading} size="large" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loading}>No session found. Please log in.</Text>
      </SafeAreaView>
    );
  }

  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - user.age;

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.refreshIconContainer, { transform: [{ rotate }] }]}>
        <MaterialIcons name="refresh" size={24} color="black" />
      </Animated.View>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} imageStyle={{ opacity: 0.2 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000"
            />
          }
        >
          <View style={styles.banner}>
            <TouchableOpacity style={styles.backButton} >
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.bannerText}>Driver Licence</Text>
            <Image source={qldGovLogo} style={styles.qldGovLogo} />
          </View>

          <View style={styles.licenseContainer}>
            <Image source={placeholderImage} style={styles.profileImage} />
            <View style={styles.licenseDetails}>
              <Text style={styles.userName}>{user.firstname.toUpperCase()} {user.middlename.toUpperCase()}</Text>
              <Text style={styles.userName_b}>{user.lastname.toUpperCase()}</Text>
              <Text style={styles.label}>DoB</Text>
              <Text style={styles.detailText}>{user.day} {months[user.month]} {birthYear}</Text>

              <Text style={styles.label}>Licence No.</Text>
              <Text style={styles.detailText}>{licenseNum}</Text>

              <Text style={styles.label}>Information was refreshed online:</Text>
              <View style={styles.inlineDetails}>
                <Text style={styles.detailText}>13 Aug 2024 07:45am</Text>
                <ActivityIndicator size={16} color="black" style={styles.syncIcon} />
                <Text style={styles.updatingText}>Updating</Text>
              </View>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.status}>Current</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.inlineDetails}>
                <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
                <Text style={styles.age}>Over 18</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.detailText}>(C) Car <Text style={styles.icon}>🚗</Text></Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.detailText}>(L) Learner</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Expiry</Text>
              <Text style={styles.detailText}>28 Feb 2027</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.label}>Conditions</Text>
              <Text style={styles.detailText}>-</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareText}>SHARE DRIVER LICENCE</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 0,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    backgroundColor: '#FBB03B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  qldGovLogo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  },
  licenseContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  licenseDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  userName_b: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333333',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777777',
    marginTop: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333333',
  },
  inlineDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    marginHorizontal: 4,
  },
  updatingText: {
    fontSize: 12,
    color: '#777777',
    marginBottom: '10px'
  },
  statusContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: "#4CAF50",
    borderRadius: '5px',
    padding: '7px'
  },
  age: {
    fontSize: 16,
    color: 'green',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  shareText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 16,
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginLeft: 8,
  },
  divider: {
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.2, // Adjust the opacity as needed
  },
});

export default GovID;
