import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './components/HomePage';
import Settings from './components/pages/Settings';
import ScanQR from './components/pages/ScanQR';
import GovID from './components/pages/GovID';
import CustomHeader from './components/CustomHeader';
import ShareID from './components/pages/ShareID';
import CustomHeaderShare from './components/CustomHeaderShare';
import FakeShareID from './components/pages/FakeShareID';
import PinScreen from './components/PinScreen';
import Login from './components/Login';

const App = () => {
  const Stack = createStackNavigator();
  // Register service worker for PWA
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Pin" component={PinScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Scan" component={ScanQR} options={{ headerShown: false }} />
        <Stack.Screen name="Nav" component={CustomHeader} options={{ headerShown: false }} />
        <Stack.Screen name="NavShare" component={CustomHeaderShare} options={{ headerShown: false }} />
        <Stack.Screen name="Share" component={ShareID} options={{ header: () => <CustomHeaderShare redirectTo={'GovID'} /> }} />
        <Stack.Screen name="FakeDisplay" component={FakeShareID} options={{ header: () => <CustomHeaderShare redirectTo={'Share'} /> }} />
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

export default App;

const styles = StyleSheet.create({
  // Add any global styles if necessary
});