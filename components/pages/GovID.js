import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Animated, Easing, ActivityIndicator, Platform, Modal } from 'react-native';
import { supabase } from '../supabaseClient';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon set
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CustomHeader from '../CustomHeader';
import DriverLicenseCard from '../DriverLicenseCard';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const GovID = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const backgroundImage = require('./images/background.png'); 
  const tickImage = require("./images/tick.png");
  const isInWebAppiOS = (Platform.OS === 'ios');

  // if (isInWebAppiOS){
  //   PullToRefresh.init({
  //     mainElement: 'body',
  //     onRefresh() {
  //       setRefreshing(true);
  //       fetchUserData();
  //       setLastRefreshed(getCurrentTime());
    
  //       setTimeout(() => {
  //         setRefreshing(false);
  //       }, 1200);
  //     }
  //   });
  // }

  // signatures
  const [signature, setSignature] = useState(null);
  const signature_1 = require('./signatures/signature.png');
  const signature_2 = require('./signatures/signature1.png');
  const signature_3 = require('./signatures/signature2.png');
  const signature_4 = require('./signatures/signature3.png');
  const signature_5 = require('./signatures/signature4.png');

  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [profilePicture, setProfilePicture] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

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


    const cardnumbergenerator = () => {
      // 10 character alpha numeric random string
      const cardNumber = Math.random().toString(36).substr(2, 10);
      setCardNumber(cardNumber.toUpperCase());
    }



    const determine_signature = () => {
      // random num from 0 to 5 
      // signature based on random num :d
      // time to spam racial slurs 
      const signatures = [signature_1, signature_2, signature_3, signature_4, signature_5];
      setSignature(signatures[Math.floor(Math.random() * signatures.length)]);      
    }
  
    const loadData = async () => {
      await fetchUserData(); // Fetch user data
      generateLicenseNum(); // Generate license number
      generateExpiryDate(); // Generate expiry date
      setLastRefreshed(getCurrentTime()); // Generate random time
      determine_signature(); // Determine signature
      cardnumbergenerator(); // Generate card number
      animateBackground(); // Start background animation
      setIsLoading(false); // Set loading to false when everything is ready
    };
    
    loadData(); // Execute the data loading
  }, []); // Empty dependency array to run only on mount

  const generateLicenseNum = async () => {
    const storedLicenseNum = await AsyncStorage.getItem('licenseNum');
    console.log(storedLicenseNum)

    if (storedLicenseNum) {
      setLicenseNum(storedLicenseNum);
      console.log("License number already exists:", storedLicenseNum);
    } else {
      let license_num = '';
      for (let i = 0; i < 9; i++) {
        license_num += Math.floor(Math.random() * 10).toString();
      }

      await AsyncStorage.setItem('licenseNum', license_num);
      setLicenseNum(license_num);
    }
  };

  const getCurrentTime = () => {
    // Get current time
    const now = new Date();
    // Format date
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  
    return `${day} ${month} ${year} ${formattedHours}:${minutes}${ampm}`;
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
        setSession(sessionObj);

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', sessionObj.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          console.log('User data:', data);
          setProfilePicture(data.photo || "");
          console.log('FETCH NORM', data.photo, ' VS -> ', profilePicture);
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
    setLastRefreshed(getCurrentTime());

    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };



  


  const safeUpperCase = (text) => (text || "").toUpperCase();

  const toggleImageExpansion = () => {
    console.log('wheyyyyyyy');
    setIsImageExpanded(!isImageExpanded);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.Image
          source={backgroundImage}
          style={[
            styles.backgroundImage,
            { transform: [{ scale: scaleAnim }] },
          ]}
        />
        <CustomHeader />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
          style={{width:'100%', height: '100%'}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
              colors={['grey']}
              progressBackgroundColor={'black'}
            />
          }
        >
                          
          <View style={styles.digitalID}>
            <View style={styles.profileContainer}>
              {profilePicture && (
                <TouchableOpacity onPress={toggleImageExpansion}>
                  <Image style={styles.profilePicture} source={{ uri: profilePicture }} />
                </TouchableOpacity>
              )}
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
                    <Text style={styles.licenseNoLabel}>Licence No.</Text>
                    <Text style={styles.licenceNum}>{licenseNum}</Text>
                  </>
                )}
              </View>
            </View>

            {/* Expanded Image Modal */}
            {isImageExpanded && (
              <Modal transparent={true} visible={isImageExpanded} animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={toggleImageExpansion}>
                  <Image style={styles.expandedImage} source={{ uri: profilePicture }} />
                </TouchableOpacity>
              </Modal>
            )}
            <View style={styles.refreshed}>
              <View style={styles.refreshTextContainer}>
                <Text style={styles.refreshLabel}>Information was refreshed online: </Text>
                <Text style={styles.refreshTime}>{lastRefreshed}</Text>
              </View>
              {refreshing && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading...</Text>
                  <ActivityIndicator size="small" color="#000000" style={styles.loadingIcon} />
                </View>
              )}
            </View>


            <View style={styles.divider} />
    
            <View style={styles.statusContainer}>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusOutline}>Status ⓘ</Text>
              </View>
              <TouchableOpacity style={styles.statusButton}>
                <Text style={styles.statusButtonText}>Current</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.ageContainer}>
              <Text style={styles.ageLabel}>Age</Text>
              <View style={styles.ageStatusContainer}>
                <Image source={tickImage} style={styles.ageIcon} />
                <Text style={styles.ageText}>Over 18</Text>
              </View>
            </View>

            <View style={styles.divider} />
    
            <View style={styles.vehicleInfo}>
              <View style={styles.vehicleClass}>
                <Text style={styles.labelBasicGrey}>Class</Text>
                <Text style={styles.vehicleTextWithIcon}>(C) Car</Text>
              </View>
              <View style={styles.vehicleType}>
                <Text style={styles.labelBasicGrey}>Type</Text>
                <Text style={styles.vehicleTextCentered}>(P1) Provisional</Text>
              </View>
              <View style={styles.idExpiry}>
                <Text style={styles.labelBasicGrey}>Expiry</Text>
                <Text style={styles.vehicleTextCentered}>{expiryDate}</Text>
              </View>
            </View>
    
            <View style={styles.divider} />
    
            <View style={styles.conditions}>
              <Text style={styles.labelBasicGrey}>Conditions</Text>
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
                    <Text>{safeUpperCase(user.houseNumber)} {safeUpperCase(user.street)} {safeUpperCase(user.type)}</Text>
                    <Text>{safeUpperCase(user.suburb)}</Text>
                    <Text>QLD {safeUpperCase(user.postCode)}</Text>
                    <Text>AU</Text>
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
              <Text style={styles.label}>Card number</Text>
              <View style={styles.cardNumber}>
                <Text style={styles.value}>{cardNumber}</Text>
              </View>
            </View>
    
            <View style={styles.divider} />
    
            <View style={styles.countryInfo}>
              <View style={styles.country}>
                <Text style={styles.label}>Issuing Country</Text>
                <Text style={styles.value}>AU</Text>
              </View>
              <View style={styles.authority}>
                <Text style={styles.label}>Issuing Authority</Text>
                <View style={styles.space} />
                <Text style={styles.value}>Queensland Government{'\n'}Department of Transport{'\n'}and Main Roads</Text>
              </View>
            </View>
    
          </View>
          <View style={styles.bigSpace}>

          </View>
        </ScrollView>
        <DriverLicenseCard />
      </SafeAreaView>
    </SafeAreaProvider>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150, // Ensure content starts below the sticky header
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures ScrollView can grow and take up available space
    paddingTop: 300
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    position: 'fixed',
    zIndex: 1,
    resizeMode: 'contain', // Ensures the image covers the entire screen while maintaining aspect ratio
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    margin: '27%',
    marginTop: '80%'
  },
  digitalID: {
    padding: 20,
    zIndex: 1, // Ensure this is above the background
    backgroundColor: 'white', // Ensure the background color is white
    borderTopLeftRadius: 20, // Add curved corner to top-left
    borderTopRightRadius: 20, // Add curved corner to top-right
    borderBottomLeftRadius: 0, // Ensure no curve at bottom-left
    borderBottomRightRadius: 0, // Ensure no curve at bottom-right
    overflow: 'hidden', // Prevent content from spilling outside the border radius
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 125,
    height: 145,
    marginRight: 15,
    borderRadius: '5px',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay background
  },
  expandedImage: {
    width: '90%', // Set the width of the expanded image
    height: '90%',
    resizeMode: 'contain', // Ensure the image keeps its aspect ratio
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
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
    flexWrap: 'wrap', // Allow wrapping if necessary
  },
  refreshTextContainer: {
    flexDirection: 'column',
  },
  refreshLabel: {
    fontSize: 16,
    color: 'grey',
  },
  refreshTime: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5, // Space between label and time
  },
  loadingContainer: {
    position: 'relative',
    alignSelf: 'flex-start', // Align container to the left
  },
  loadingIcon: {
    position: 'absolute',
    left: 0, // Align icon to the left
    zIndex: 1,
    transform: [{ scale: 0.7 }],
  },
  loadingText: {
    fontSize: 13,
    color: '#000',
    zIndex: 2,
    paddingLeft: 30, // Add some padding to separate the text from the icon
  },

  refreshTime: {
    fontWeight: 'bold',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',  // Center the button horizontally
    marginVertical: 10,
  },
  statusTextContainer: {
    alignSelf: 'flex-start',  // Align the text container to the left
    position: 'absolute',     // Position it absolutely within the parent
    left: 0,                  // Align the text to the left edge
  },
  statusButton: {
    width: 95,
    height: 35,
    backgroundColor: '#2e9170',
    justifyContent: 'center',
    borderRadius: 10,
  },
  statusButtonText: {
    color: 'white',
    textAlign: 'center', // Center the text within the button
  },
  statusOutline: {
    textDecorationLine: 'underline',
    color: 'grey',
    flex: 1, // Take up available space
    textAlign: 'left', // Align text to the left
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  
  ageLabel: {
    color: 'grey',
    fontSize: 16,
    marginRight: 105, // Adjust this value to increase or decrease space between "Age" and "(tick) Over 18"
  },
  
  ageStatusContainer: {
    flexDirection: 'row',   // Keep the icon and text on the same line
    alignItems: 'center',   // Vertically align the icon and text
  },
  
  ageText: {
    fontSize: 17,
    color: '#65c1a9',
    textAlign: 'center',
  },
  
  ageIcon: {
    marginRight: 5, // Space between the icon and the "Over 18" text
    width: 40, 
    height: 40
  },
  
  
  checkIconContainer: {
    marginRight: 10,
  },  

  // VEHICLE INFORMATION CSS
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,  // Space between each row
  },
  vehicleClass: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: 350,
  },  
  vehicleType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: 350,
    
  },
  idExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 350, 
  },
  vehicleTextWithIcon: {
    fontSize: 17,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center', // Center text horizontally
    flex: 1, // Allow text to take up remaining space
    marginLeft: -100, // Slightly shift text to the left
  },
  vehicleTextCentered: {
    fontSize: 17,
    textAlign: 'center', // Center text horizontally
    flex: 1, // Allow text to take up remaining space
    marginLeft: -75, // Slightly shift text to the left
  },
  // DIVIDER CSS
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },

  // MISC CSS
  conditions: {
    marginTop: 10,
  },
  italicText: {
    fontStyle: 'italic',
    color: 'grey',
    fontSize: 11,
  },
  labelBasicGrey: {
    color: 'grey',
    fontSize: 16,
    width: 100, // Fixed width to keep labels aligned
    textAlign: 'left', // Align text to the left
  },
  licenseNoLabel: {
    color: 'black',
    fontSize: 12,
    width: 100,
    lineHeight: '5px',
    marginTop: '10px',
  },

  // ADDRESS CSS
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

  // SIGNATURE
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

  // CARD NUMBER
  cardNumberContainer: {
    marginTop: 20,
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5, // Space between country label and value
  },
  cardNumberText: {
    fontSize: 17,
    textAlign: 'center', // Center the card number text
  },

  // COUNTRY & ISSUING AUTHORITY
  countryInfo: {
    marginBottom: 15,
    paddingHorizontal: 10, // Adjust the horizontal padding as needed
  },
  country: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5, // Space between country label and value
  },
  authority: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right', // Align value to the right
  },
  space: {
    width: 60,
  },
  bigSpace: {
    height: 70
  },

});

export default GovID;