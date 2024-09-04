import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native-web"; // Import components from react-native-web
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Settings from "./pages/Settings";
import ScanQR from "./pages/ScanQR";
import Icon from "react-native-vector-icons/Ionicons";

const HomePageContent = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(true);

  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const carBroomBroom = "/assets/icon.png"; // Use relative path

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
        if (data.user && data.user.id) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("uuid", data.user.id);

          if (!userError && userData.length > 0) {
            const userInfo = userData[0];
            setFName(userInfo.firstname || "");
            setMName(userInfo.middlename || "");
            setLName(userInfo.lastname || "");
            setProfilePicture(userInfo.photo || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const redirectToId = () => {
    // PWA-specific navigation handling
    window.location.href = "/GovID"; // Navigate using window.location.href
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div style={styles.container}>
      <View style={styles.content}>
        <div style={styles.bannerColour}></div>
        {fakeLoading ? (
          <div style={styles.loadingScreen}>
            <Text style={styles.loadingFont}>Fetching your digital wallet</Text>
            <ActivityIndicator size={50} color="#6a5964" />
          </div>
        ) : (
          <div style={styles.safetyPadding}>
            <div style={styles.profileContainer}>
              {profilePicture && (
                <img style={styles.profilePicture} src={profilePicture} alt="Profile" />
              )}
              <div style={styles.legalNameContainer}>
                <Text style={styles.legalName}>{fName} {mName}</Text>
                <Text style={styles.bold}>{lName}</Text>
              </div>
            </div>
            <Text style={styles.header}>Credentials</Text>
            <TouchableOpacity style={styles.button} onClick={redirectToId}>
              <Text style={styles.buttonText}>
                <img style={styles.icon} src={carBroomBroom} alt="Icon" /> Drivers License
              </Text>
            </TouchableOpacity>
          </div>
        )}
      </View>
    </div>
  );
};

const HomePage = () => {
  const Tab = createBottomTabNavigator();

  return (
    <div style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Scan QR") {
              iconName = "qr-code";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#a14e61",
          tabBarInactiveTintColor: "#94737b",
          tabBarStyle: { position: "absolute", height: 60 }, // Position the navbar at the bottom
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomePageContent} />
        <Tab.Screen name="Scan QR" component={ScanQR} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </div>
  );
};

export default HomePage;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#e7e6ed",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 20,
  },
  legalNameContainer: {
    flexDirection: "column",
  },
  legalName: {
    fontSize: 24,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
    marginBottom: 20,
  },
  safetyPadding: {
    padding: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
    flex: 1,
    paddingLeft: 10,
    textAlign: "center",
  },
  icon: {
    width: 30,
    height: 30,
    alignItems: "center",
  },
  bannerColour: {
    backgroundColor: "#972541",
    width: "100%",
    height: 70,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e7e6ed",
  },
  loadingFont: {
    fontSize: 16,
    marginBottom: 50,
  },
};
