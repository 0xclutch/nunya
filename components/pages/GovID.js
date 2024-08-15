import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Animated, Easing } from 'react-native';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon set

const GovID = () => {
  const [user, setUser] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const qldGovLogo = require('./images/qldgov.png');
  const placeholderImage = require('./images/placeholder.jpg');
  const backgroundImage = require('./images/background.png'); 

  // signatures
  const [signature, setSignature] = useState(null);
  const signature_1 = require('./signatures/signature.png');
  const signature_2 = require('./signatures/signature1.png');
  const signature_3 = require('./signatures/signature2.png');
  const signature_4 = require('./signatures/signature3.png');
  const signature_5 = require('./signatures/signature4.png');

  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const months = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sept",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
  };

  useEffect(() => {
    const animateBackground = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 750,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    };

    const generateRandomTime = () => {
      // generate random time today, 3hrs previous
      const today = new Date();
      const threeHoursAgo = new Date(today.getTime() - 3 * 60 * 60 * 1000);
      const randomTime = new Date(threeHoursAgo.getTime() + Math.random() * (today.getTime() - threeHoursAgo.getTime()));
    
      // Format date
      const day = randomTime.getDate().toString().padStart(2, '0');
      const month = randomTime.toLocaleString('en-US', { month: 'short' });
      const year = randomTime.getFullYear();
      const hours = randomTime.getHours();
      const minutes = randomTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    
      const formattedTime = `${day} ${month} ${year} ${formattedHours}:${minutes}${ampm}`;
    
      setLastRefreshed(formattedTime);
    }

    const cardnumbergenerator = () => {
      // 10 character alpha numeric random string
      const cardNumber = Math.random().toString(36).substr(2, 10);
      setCardNumber(cardNumber.toUpperCase());

    }

    

    const determine_signature = () => {
      // random num from 0 to 5 
      const randomNum = Math.floor(Math.random() * 6);
      // signature based on random num
      if(randomNum === 0) {
        setSignature(signature_1);
      } else if(randomNum === 1) {
        setSignature(signature_2);
      } else if(randomNum === 2) {
        setSignature(signature_3);
      } else if(randomNum === 3) {
        setSignature(signature_4);
      } else if(randomNum === 4) {
        setSignature(signature_5);
      } else {
        setSignature(signature_1);
      }
    }
  
    fetchUserData();
    generateLicenseNum();
    generateExpiryDate();
    generateRandomTime();
    determine_signature();
    cardnumbergenerator();
    animateBackground();
  }, []); // Empty dependency array to run only on mount

  const generateLicenseNum = () => {
    let license_num = '';
    for (let i = 0; i < 9; i++) { 
      license_num += Math.floor(Math.random() * 10).toString();
    }
    setLicenseNum(license_num);
  };

  const calculate_year_birth = (age) => {
    const current_year = new Date().getFullYear();
    const year_birth = current_year - age;
    return year_birth;
  }

  const fetchUserData = async () => {
    try {
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
          console.error('Error fetching user data:', error);
        } else {
          console.log('User data:', data);
          setUser(data);
        }
      } else {
        setUser(null);
        console.error("Couldn't get session");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateExpiryDate = () => {
    const currentYear = new Date().getFullYear();
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const expiryYear = currentYear + 3;
    const formattedExpiryDate = `${randomDay} ${months[randomMonth]} ${expiryYear}`;
    setExpiryDate(formattedExpiryDate);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();

    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  const safeUpperCase = (text) => (text || "").toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={backgroundImage}
        style={[
          styles.backgroundImage,
          { transform: [{ scale: scaleAnim }] },
        ]}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.digitalID}>
          <View style={styles.profileContainer}>
            <Image style={styles.profilePicture} source={placeholderImage} />
            <View style={styles.textContainer}>
              {user && (
                <>
                  <Text style={styles.unimportantNames}>
                    {safeUpperCase(user.firstname)} {safeUpperCase(user.middlename)}
                  </Text>
                  <Text style={styles.importantLast}>
                    {safeUpperCase(user.lastname)}
                  </Text>

                  <Text style={styles.labelBasicGrey}>DoB</Text>
                  <Text style={styles.dateOfBirth}>
                    {user.day} {months[user.month]} {calculate_year_birth(user.age)}
                  </Text>
                  <Text style={styles.labelBasicGrey}>Licence No.</Text>
                  <Text style={styles.licenceNum}>{licenseNum}</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.refreshed}>
            <Text style={styles.labelBasicGrey}>Information was refreshed online: </Text>
            <Text style={styles.refreshTime}>{lastRefreshed}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.statusContainer}>
            <Text style={styles.statusOutline}>Status ⓘ</Text>
            <TouchableOpacity style={styles.statusButton}>
              <Text style={styles.statusButtonText}>Current</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.ageContainer}>
            <Text style={styles.labelBasicGrey}>Age</Text>
            <Text style={styles.age}><Icon name="check-circle" size={20} color="#317d33" /> Over 18</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleClass}>
              <Text style={styles.labelBasicGrey}>Class</Text>
              <Text style={styles.vehicleTextCentered}>(C) Car  <Icon name="car" size={20} color="#000000" /> </Text>
            </View>
            <View style={styles.vehicleType}>
              <Text style={styles.labelBasicGrey}>Type</Text>
              <Text style={styles.vehicleTextCentered}>(P) Provisional</Text>
            </View>
            <View style={styles.idExpiry}>
              <Text style={styles.labelBasicGrey}>Expiry</Text>
              <Text style={styles.vehicleTextCentered}>{expiryDate}</Text>
            </View>
          </View>


          <View style={styles.divider} />

          <View style={styles.conditions}>
            <Text style={styles.labelBasicGrey}>Conditions</Text>
            <Text style={styles.labelBasicGrey}>-</Text>
          </View>
          
          <View style={styles.divider} />
          <View style={styles.addressContainer}>
            <View style={styles.addressTitleContainer}>
              <Text style={styles.labelBasicGrey}>Address</Text>
              <Text style={styles.italicText}>Are your details up to {'\n'}date?</Text>
            </View>
            <View style={styles.addressInfo}>
              {user && (
                <>
                  <Text>{user.houseNumber} {user.street} {user.type}</Text>
                  <Text>{user.suburb}</Text>
                  <Text>{user.state} {user.postCode}</Text>
                  <Text>{user.country}</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.signatureContainer}>
              <Text style={styles.statusOutline}>Signature 🔍</Text>
              <Image style={styles.signature} source={signature} />
          </View>

          <View style={styles.divider} />

          <View style={styles.cardNumberContainer}>
              <Text style={styles.labelBasicGrey}>Card number</Text>
              <View style={styles.cardNumber}>
                <Text style={styles.vehicleTextCentered}>{cardNumber}</Text>
              </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.countryInfo}>
            <Text style={styles.labelBasicGrey}>Issuing Country</Text>
            <View style={styles.country}>
              <Text style={styles.vehicleTextCentered}>AU</Text>
            </View>

            <Text style={styles.labelBasicGrey}>Issuing Authority</Text>
            <View style={styles.authority}>
              <Text style={styles.vehicleTextCentered}>Queensland Government{'\n'}Department of Transport{'\n'}and Main Roads</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    resizeMode: 'contain', // Ensures the image covers the entire screen while maintaining aspect ratio
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    margin: '20%',
    marginTop: '40%'
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  digitalID: {
    padding: 20,
    zIndex: 1, // Ensure this is above the background
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profilePicture: {
    width: 105,
    height: 145,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  unimportantNames: {
    fontSize: 19,
  },
  importantLast: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  dateOfBirth: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  licenceNum: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  refreshed: {
    marginTop: 3,
  },
  labelBasicGrey: {
    color: 'grey',
    fontSize: 16,
    flex: 1,
  },
  refreshTime: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusButton: {
    width: 95,
    height: 35,
    backgroundColor: '#317d33',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  statusButtonText: {
    color: 'white',
    textAlign: 'center', // Center the text within the button
  },
  statusOutline: {
    textDecorationLine: 'underline',
    color: 'grey',
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  age: {
    fontSize: 17,
    color: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the age text horizontally
  },
  checkIconContainer: {
    marginRight: 10,
  },
  vehicleTextCentered: {
    fontSize: 17,
    flex: 1,
    textAlign: 'center',  // Center the value text
  },
  vehicleInfo: {
    marginTop: 20,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  // Distribute space between header and value
    marginBottom: 10,  // Space between each row
  },

  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  conditions: {
    marginTop: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  addressTitleContainer: {
    flex: 1,
  },
  addressInfo: {
    flex: 2,
    marginLeft: 20,
  },
  italicText: {
    fontStyle: 'italic',
    color: 'grey',
    fontSize: 11,
  },
  signatureContainer: {
    marginTop: 20,
  },
  signature: {
    width: 240,
    height: 80,
    resizeMode: 'center',
    fontSize: 24,
    marginLeft: 150
  },
  cardNumberContainer: {
    marginTop: 20,
  },
  cardNumber: {
    marginTop: 5,
  },
  cardNumberText: {
    fontSize: 17,
    textAlign: 'center', // Center the card number text
  },

  countryInfo: {
    marginTop: 20,
  },
  country: {
    marginTop: 5,
  },
  countryText: {
    fontSize: 17,
    textAlign: 'center', // Center the country text
  },
  authority: {
    marginTop: 5,
  },
  authorityText: {
    fontSize: 17,
    textAlign: 'center', // Center the authority text
  },
});

export default GovID;
