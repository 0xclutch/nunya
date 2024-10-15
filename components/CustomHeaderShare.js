import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const CustomHeaderShare = ({ redirectTo }) => {
  const navigation = useNavigation();

  const warpToHome = () => {
    navigation.navigate(redirectTo);
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <LinearGradient
        colors={['#ecc47e', '#c29d6d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalGradient}
      />
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={warpToHome} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 999,
    backgroundColor: '#ecc47e',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', // Align content to the left
    marginTop: 25
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 5, // Spacing between arrow and text
  },
  bannerText: {
    fontSize: 16,
    color: '#210a03',
    marginTop: 30, // Adjust spacing between "Back" and "Driver Licence"
    margin: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  qldGovLogo: {
    width: 200,   // Scaled-up width
    height: 100,  // Scaled-up height
    resizeMode: 'contain',
  },

  gradientContainer: {
    height: 150,
    transform: [{ rotate: '-50deg' }],
    marginTop: -80,
  },
  diagonalGradient: {
    flex: 1,
  },
});

export default CustomHeaderShare;