import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Button, Linking, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have installed react-native-vector-icons
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { supabase } from '../supabaseClient';


const OpenURLButton = ({url}) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);
};



const Settings = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [allowNotifications, setAllowNotifications] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleNotifications = () => setAllowNotifications(previousState => !previousState);
  
  const qldGovLogo = require('./images/qldgov.png');



  async function registerForPushNotificationsAsync() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  }

  const LogoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    redirectToLogin();
  }

  const redirectToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.button} >
          <Icon name="key-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Change PIN</Text>
          <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="finger-print-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Enable Face ID</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="shield-checkmark-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Securely reset Digital Licence</Text>
          <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="notifications-circle" size={20} color="#000" />
          <Text style={styles.buttonText}>Enable push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={allowNotifications ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleNotifications}
            value={allowNotifications}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="document-text-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Terms and Conditions</Text>
          <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="globe-outline" size={20} color="#000" onPress={(OpenURLButton("https://www.qld.gov.au/transport/online-services"))} />
          <Text style={styles.buttonText}>Access TMR Online Services</Text>
          <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="person-circle-outline" size={20} color="#000" onPress={(OpenURLButton("https://identity.qld.gov.au/login/login.html"))}/>
          <Text style={styles.buttonText}>Manage your Queensland Digital Identity</Text>
          <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedbackButton} onPress={(OpenURLButton("https://www.transporttalk.tmr.qld.gov.au/jfe/form/SV_8BpqoBULWNnlKZw"))}>
          <Text style={styles.feedbackText}>GIVE US YOUR FEEDBACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={(LogoutUser())}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
        <Image source={qldGovLogo} style={styles.logo} />
          <Text style={styles.details}>Digital License App {'\n'}Copyright© State of Queensland 2024{'\n'}Version No: 2.19.0 (6636)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Set background to white
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures ScrollView can grow and take up available space
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for buttons
    borderBottomColor: '#ccc', // Light grey border color
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#333', // Dark text for button
    flex: 1, // Take up available space between icons
    paddingLeft: 10, // Space after the icon
  },
  feedbackButton: {
    backgroundColor: '#e74c3c', // Matching red background for feedback button
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  feedbackText: {
    color: '#fff', // White text for feedback
    fontSize: 18,
    fontWeight: 'bold',
  },
  logout: {
    backgroundColor: '#c0392b', // Darker red for the logout button
    padding: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff', // White text for logout
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
  details: {
    textAlign: "center",

  }
});

export default Settings;