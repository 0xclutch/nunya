import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const CustomHeader = () => {
  const navigation = useNavigation();
  const qldGovLogo = require('./pages/images/qldgov.png');

  const warpToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={['#ecc47e', '#c29d6d']} // Define your gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.diagonalGradient} // Apply gradient to the diagonal slice
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={warpToHome} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.bannerText}>Driver Licence</Text>
        </View>
        <Image source={qldGovLogo} style={styles.qldGovLogo} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ecc47e', // Fallback background color
    overflow: 'hidden',
    position: 'sticky',
  },
  gradientContainer: {
    backgroundImage: 'linear-gradient(to right, #ecc47e, #c29d6d)', // Use CSS gradient
    height: 150,
    transform: [{ rotate: '-20deg' }],
    marginTop: -80,
  },
  diagonalGradient: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 5,
  },
  bannerText: {
    fontSize: 16,
    color: '#210a03',
    marginTop: 30,
    margin: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  qldGovLogo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});

export default CustomHeader;
