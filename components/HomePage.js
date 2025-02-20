import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Settings from "./pages/Settings";
import ScanQR from "./pages/ScanQR";

const HomePageContent = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const carBroomBroom = require("./pages/images/icon.png");

  useEffect(() => {
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

    fetchUser();
    setTimeout(() => setFakeLoading(false), 2000);
  }, []);

  const redirectToId = () => navigation.navigate("GovID");

  if (loading || fakeLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.loadingFont}>{loading ? "Loading user..." : "Fetching your digital wallet"}</Text>
        <ActivityIndicator size={50} color="#6a5964" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerColour}></View>
      <View style={styles.profileContainer}>
        <View style={styles.topBar}>
          {profilePicture ? (
            <Image style={styles.profilePic} source={{ uri: profilePicture }} />
          ) : (
            <Ionicons name="person-circle" size={60} color="#fff" />
          )}
          <View style={styles.legalNameContainer}>
            <Text style={styles.legalName}>{fName} {mName}</Text>
            <Text style={styles.bold}>{lName}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.header}>Credentials</Text>
      <TouchableOpacity style={styles.button} onPress={redirectToId}>
        <Image style={styles.icon} source={carBroomBroom} />
        <Text style={styles.buttonText}>Driver's License</Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" style={styles.arrowIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const HomePage = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={route.name === "Home" ? "home" : route.name === "Scan QR" ? "qr-code" : "settings"} size={size} color={color} />
        ),
        tabBarActiveTintColor: "#a14e61",
        tabBarInactiveTintColor: "#94737b",
        headerShown: false,
        tabBarStyle: { paddingBottom: 10, height: 70 },
      })}
    >
      <Tab.Screen name="Home" component={HomePageContent} />
      <Tab.Screen name="Scan QR" component={ScanQR} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e7e6ed" },
  loadingScreen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e7e6ed" },
  loadingFont: { fontSize: 16, marginBottom: 50 },
  topBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#972541", paddingVertical: 20, paddingHorizontal: 20 },
  profilePic: { width: 60, height: 60, borderRadius: 30, marginRight: 15, right: '125' },
  bannerColour: { height: 10, backgroundColor: "#972541", flexGrow: 1 },
  profileContainer: { alignItems: "center", marginTop: 20 },
  header: { fontSize: 18, fontWeight: "bold", margin: 20, color: "#5D5C5F" },
  button: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 8, margin: 20 },
  icon: { width: 40, height: 40, marginRight: 10 },
  buttonText: { fontSize: 16, color: "#333" },
  arrowIcon: { marginLeft: "auto" },
});

export default HomePage;
