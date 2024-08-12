import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Text } from "react-native";

const HomePage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        setUser(data);
        console.log(data);     

        
        

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text>
      {user ? `Hello, ${user.user.id}!` : "No user found"}
    </Text>
  );
};

export default HomePage;