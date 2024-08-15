import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircleFilled } from '@ant-design/icons';

const GovID = () => {
  const [user, setUser] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const qldGovLogo = require('./images/qldgov.png');
  const placeholderImage = require('./images/placeholder.jpg');
  const backgroundImage = require('./images/background.png'); 

  const [lastRefreshed, setLastRefreshed] = useState(null);

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
  
    fetchUserData();
    generateLicenseNum();
    generateExpiryDate();
    generateRandomTime();
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

  const generateExpiryDate = () => {
    const currentYear = new Date().getFullYear();
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const expiryYear = currentYear + 3;
    const formattedExpiryDate = `${randomDay} ${months[randomMonth]} ${expiryYear}`;
    setExpiryDate(formattedExpiryDate);
  };

  const safeUpperCase = (text) => (text || "").toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
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

                <Text>DoB</Text>
                <Text style={styles.dateOfBirth}>
                  {user.day} {months[user.month]} {calculate_year_birth(user.age)}
                </Text>
                <Text>Licence No.</Text>
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
            <Text style={{ color: "white"}}>Current</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.ageContainer}>
          <Text style={styles.labelBasicGrey}>Age</Text>
          <CheckCircleFilled />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  digitalID: {
    paddingLeft: 20,
  },
  profileContainer: {
    flexDirection: 'row', // Arrange items side by side
    alignItems: 'flex-start', // Align items vertically at the top
    marginBottom: 10, // Space below the profile container
  },
  profilePicture: {
    width: 105,
    height: 145,
    marginRight: 15, // Space between the image and the text
  },
  textContainer: {
    flex: 1, // Allow the text container to take remaining space
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
    fontWeight: 'bold'
  },
  licenceNum: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  refreshed: {
    marginTop: 3, // Space above the refreshed information
  },
  labelBasicGrey: {
    color: 'grey'
  },
  refreshTime: {
    fontWeight: 'bold'
  },
  statusContainer: {
    flexDirection: 'row', // Arrange items side by side
    alignItems: 'center', // Center align vertically
    justifyContent: 'space-between', // Space between items
  },
  statusButton: {
    width: 95,
    height: 35,
    backgroundColor: '#317d33',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 90
  },
  statusOutline: {
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    borderRadius: 10
  }
});

export default GovID;
