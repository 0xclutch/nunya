import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { supabase } from '../supabaseClient'; // Path to your Supabase client

const GovID = () => {
  const [user, setUser] = useState(null);
  const qldGovLogo = require('./images/qldgov.png');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1) // Adjust or remove limit based on your requirements
        .single();

      if (error) console.log('error', error);
      else setUser(data);
    };

    fetchUserData();
  }, []);

  if (!user) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={qldGovLogo}
          style={styles.logo}
        />
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Driver Licence</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.detailLabel}>DoB</Text>
        <Text style={styles.detail}>{user.dob}</Text>
        <Text style={styles.detailLabel}>Licence No.</Text>
        <Text style={styles.detail}>{user.licence_number}</Text>
        <Text style={styles.detailLabel}>Expiry</Text>
        <Text style={styles.detail}>{user.expiry}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 20, // Increased padding to fit the logo properly
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120, // Fixed height to ensure enough space for the logo
  },
  logo: {
    width: 50, // Adjusted to a smaller, more appropriate size
    height: 50, // Maintained aspect ratio
    position: 'absolute',
    left: 16, // Adjusted for better alignment
    top: 35, // Adjusted to vertically center
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18, // Slightly larger text for better visibility
  },
  card: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default GovID;
