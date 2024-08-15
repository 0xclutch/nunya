import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PinScreen from './components/PinScreen';
import Login from './components/Login';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './components/HomePage';
import Settings from './components/pages/Settings';
import ScanQR from './components/pages/ScanQR';
import GovID from './components/pages/GovID';
import CustomHeader from './components/CustomHeader';



const App = () => {
  const Stack = createStackNavigator();
  const qldGovLogo = require('./components/pages/images/qldgov.png');
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Pin" component={PinScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Scan" component={ScanQR} options={{ headerShown: false }} />
        <Stack.Screen name='Nav' component={CustomHeader} options={{ headerShown: false }} />
        <Stack.Screen 
          name="GovID" 
          component={GovID} 
          options={{
            header: () => <CustomHeader />,
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  qldGovLogo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  }
});

export default App;