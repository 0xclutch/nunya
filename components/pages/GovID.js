import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, RefreshControl, Animated, Easing, TouchableOpacity, ImageBackground } from 'react-native';
import { supabase } from '../supabaseClient';
import { ActivityIndicator } from 'react-native-web';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 

const GovID = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(1))[0];
  const qldGovLogo = require('./images/qldgov.png');
  const placeholderImage = require('./images/placeholder.jpg');
  const backgroundImage = require('./images/background.png'); 

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
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
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
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} imageStyle={{ opacity: 0.1 }}>
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
            <View style={styles.licenseContainer}>
              <Image source={placeholderImage} style={styles.profileImage} />
              <View style={styles.licenseDetails}>
                <Text style={styles.userName}>{user.firstname.toUpperCase()} {user.middlename.toUpperCase()}</Text>
                <Text style={styles.userName_b}>{user.lastname.toUpperCase()}</Text>
                <Text style={styles.label}>DoB</Text>
                <Text style={styles.detailText}>{user.day} {months[user.month]} {birthYear}</Text>

                <Text style={styles.label}>Licence No.</Text>
                <Text style={styles.detailText}>{licenseNum}</Text>

                <View style={styles.informationRefreshedContainer}>
                  <Text style={styles.label}>Information was refreshed online:</Text>
                  <View style={styles.inlineDetails}>
                    <Text style={styles.detailText}>13 Aug 2024 07:45am</Text>
                    <ActivityIndicator size={16} color="black" style={styles.syncIcon} />
                    <Text style={styles.updatingText}>Updating</Text>
                  </View>
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
                  <MaterialIcons name="success" size={18} color="green" />
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
                <Text style={styles.detailText}>(P) Provisional</Text>
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
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBB03B',
  },
  container: {
    padding: 16,
    backgroundColor: '#FBB03B',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'static',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  licenseContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginRight: 16,
  },
  licenseDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userName_b: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  inlineDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  updatingText: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  icon: {
    marginLeft: 4,
    fontSize: 18,
  },
  shareButton: {
    backgroundColor: '#FBB03B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBB03B',
  },
  loading: {
    fontSize: 16,
    marginBottom: 16,
  },
  informationRefreshedContainer: {
    marginTop: 8,
  },
});

export default GovID;