import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Text, View, StyleSheet, Image, TouchableOpacity, Switch } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from "./pages/Settings";
import ScanQR from "./pages/ScanQR";
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons
import { SafeAreaView } from "react-native-safe-area-context";

// Separate component for the home page content
const HomePageContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        setUser(data.user); // Correctly set the user
        console.log('User:', data.user);

        // Move contactUserInfo here to ensure user is set
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
              // Assuming userData is an array and you want the first item
              if (userData.length > 0) {
                const userInfo = userData[0];
                setFName(userInfo.firstname || "");
                setMName(userInfo.middlename || "");
                setLName(userInfo.lastname || "");
                setProfilePicture(userInfo.profile_picture);
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
  }, []); // Only run on mount

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const styles = StyleSheet.create({
    bold: {
      fontWeight: 'bold',
      fontSize: 24, // Use a number for fontSize
    },
    legalName: {
      fontSize: 24, // Use a number for fontSize
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    header: {
      fontFamily: "Arial",
      fontSize: "24px",
      fontWeight: '400',
      marginTop: "20px",
      marginBottom: "20px"
    }
  });

  return (
    <SafeAreaView>
      <View>
        {profilePicture && (
          <Image style={styles.profilePicture} source={{ uri: profilePicture }} />
        )}
        <Text style={styles.legalName}>{fName} {mName}</Text>
        <Text style={styles.bold}>{lName}</Text>
        
        <Text style={styles.header}>Credentials</Text>
        <TouchableOpacity style={styles.button}>
          <Icon name="finger-print-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Drivers License</Text>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Main component with bottom tab navigation
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
          // Return the icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a14e61',
        tabBarInactiveTintColor: '#94737b',
        headerShown: false, // Hide the header
      })}
    >
      <Tab.Screen name="Home" component={HomePageContent} />
      <Tab.Screen name="Scan QR" component={ScanQR} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default HomePage;