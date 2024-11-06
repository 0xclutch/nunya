
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from "./pages/Settings";
import ScanQR from "./pages/ScanQR";
import Icon from 'react-native-vector-icons/Ionicons';


const HomePageContent = ({ navigation }) => {    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(true);

  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const carBroomBroom = require("./pages/images/icon.png")


  const requestNotificationPermission = () => {
    if ('Notification' in window && navigator.serviceWorker) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Proceed with setting up notifications
        } else {
          console.log('Denied notification permission.');
        }
      });
      }
  };

  useEffect(() => {
    requestNotificationPermission();
    setTimeout(() => {
      setFakeLoading(false);
    }, 2500);


    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        setUser(data.user);
        console.log('User:', data.user);

        const contactUserInfo = async () => {
          if (data.user && data.user.id) {
            console.log('Contacting DB - ' + data.user.id);
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq('uuid', data.user.id);

            if (userError) {
              console.log('Error fetching user info:', userError);
            } else {
              console.log('User data:', userData);
              if (userData.length > 0) {
                const userInfo = userData[0];
                setFName(userInfo.firstname || "");
                setMName(userInfo.middlename || "");
                setLName(userInfo.lastname || "");
                setProfilePicture(userInfo.photo || "");
              }
            }
          }
        };

        contactUserInfo();
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    document.body.classList.add("overflowHidden");
    return () => {
        document.body.classList.remove("overflowHidden");
    };
  }, []);

  const redirectToId = () => {
    navigation.navigate('GovID');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Prevent scrolling outside of the container (iOS safari fix)
  // document.addEventListener('touchmove', function(event) {
  //   if (!event.target.closest('.container')) {
  //       event.preventDefault();
  //   }
  // }, { passive: false });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e7e6ed', // Background color for the entire screen
    },
    overflowHidden: {
      overflow: 'hidden',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 40,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 5,
      marginRight: 20, // Space between image and text
    },
    legalNameContainer: {
      flexDirection: 'column',
    },
    legalName: {
      fontSize: 24,
    },
    bold: {
      fontWeight: 'bold',
      fontSize: 24,
    },
    header: {
      fontSize: 24,
      fontWeight: '400',
      marginTop: 20,
      marginBottom: 20,
    },
    safetyPadding: {
      padding: 20,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    buttonText: {
      fontSize: 18,
      color: '#333',
      flex: 1,
      paddingLeft: 10,
      alignContent: 'space-between',
      flex: 1,
      marginLeft: 20,
    },
    icon: {
      width: 30,
      height: 30,
    },
    bannerColour: {
      backgroundColor: '#972541',
      width: '110%',
      height: 70
    },

    loadingScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e7e6ed', // Background color for loading screen
    },
    loadingFont: {
      fontSize: 16,
      marginBottom: 50
    },
    modalContent: {
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    modalText: {
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerColour}></View>
      {fakeLoading && (
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingFont}>Fetching your digital wallet</Text>
          <ActivityIndicator size={50} color="#6a5964"/>
        </View>
      )}
      {!fakeLoading && (
        <View style={styles.safetyPadding}>
          <View style={styles.profileContainer}>
            {profilePicture && (
              <Image style={styles.profilePicture} source={{uri: profilePicture}} />
            )}
            <View style={styles.legalNameContainer}>
              <Text style={styles.legalName}>{fName} {mName}</Text>
              <Text style={styles.bold}>{lName}</Text>
            </View>
          </View>
          
          <Text style={styles.header}>Credentials</Text>
          <TouchableOpacity style={styles.button} onPress={redirectToId}>
            <Image style={styles.icon} source={carBroomBroom} />
            <Text style={styles.buttonText}>Drivers License</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const HomePage = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Scan QR') {
            iconName = 'qr-code';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a14e61',
        tabBarInactiveTintColor: '#94737b',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 10, // This adds a bit of padding at the bottom
          height: 70, // Slightly increase height for better spacing
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePageContent} />
      <Tab.Screen name="Scan QR" component={ScanQR} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default HomePage;