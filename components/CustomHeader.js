import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = () => {
  const navigation = useNavigation();
  const qldGovLogo = require('./pages/images/qldgov.png');

  const warpToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={warpToHome} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.bannerText}>Driver Licence</Text>
      </View>
      <Image source={qldGovLogo} style={styles.qldGovLogo} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ecc47e',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', // Align content to the left
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
});

export default CustomHeader;
