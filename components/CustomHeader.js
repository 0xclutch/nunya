import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CustomHeader = () => {
  const qldGovLogo = require('./pages/images/qldgov.png');

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.bannerText}>Driver Licence</Text>
      <Image source={qldGovLogo} style={styles.qldGovLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60, 
    paddingTop: 10, 
    width: 300
  },
  backButton: {
    fontSize: 16,
    color: 'black',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    width: "100"
  },
  qldGovLogo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
});

export default CustomHeader;
