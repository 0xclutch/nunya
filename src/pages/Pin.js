import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { Input, Button, message, Card } from "antd";
import styled from "styled-components";
import { supabase } from "../components/supabaseClient";



const PinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 16px;
`;

const StyledCard = styled(Card)`
  max-width: 360px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PinScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState("");

  let constantURL = "https://1j3bs5vsumvx.share.zrok.io";
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const fetchPin = async () => {
      if (!user) return;
  
      const { data, error } = await supabase
        .from("users")
        .select("pin")
        .eq("uuid", user.id)
        .single();
  
      if (error) {
        message.error("Error fetching PIN");
        console.error(error);
        return;
      }
  
      setStoredPin(data.pin);
    };
  
    fetchPin();
  }, [user])

  const handleLogin = () => {
    if (pin === storedPin) {
      message.success("PIN verified!");
      navigate("/dashboard"); // Redirect to homepage
    } else {
      return;
    }
  };

  const generateRandomChallenge = () => {
    // Face ID Auth
    let length = 32;
    let randomValues = new Uint8Array(length);

    window.crypto.getRandomValues(randomValues);
    return randomValues;
  };

  // const createPasskey = async () => {
  //   if(!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get) {
  //     return alert('Your mobile device does not support FaceID Authententication');
  //   }

  //   let credentials = await navigator.credentials.create({
  //     publicKey: {
  //       challenge: generateRandomChallenge(),
  //       rp: { name: "Digital License", id: window.location.hostname },
  //       // User info
  //       user: { id: new TextEncoder().encode(user.id), name: user.email, displayName: userData.firstname },
  //       pubKeyCredParams: [
  //         { type: 'public-key', alg: -7 },
  //         { type: 'public-key', alg: -257 },
  //       ],
  //       timeout: 6000,
  //       authenticatorSelection: { residentKey: 'preferred', requireResidentKey: false, userVerification: 'preferred'},
  //       attestation: 'none',
  //       extensions: { credProps: true }
  //     }
  //   });

  //   window.currentPasskey = credentials;
  //   console.log(credentials);
  // }

  const generateKey = async () => {
    if (!window.PublicKeyCredential) {
      message.error("Your device doesn't support biometric authentication");
      return;
    }
  
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          rp: { 
            id: window.location.hostname,
            name: "Digital License"
          },
          user: { 
            id: new TextEncoder().encode(user.id),
            name: user.email,
            displayName: userData.firstname 
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "required"
          },
          extensions: {
            credProps: true
          },
          attestation: 'direct', // Changed from 'none' for better security
          timeout: 60000,
          challenge: generateRandomChallenge()
        }
      });
  
      // Store the credential in your database
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        type: credential.type,
        // Add any other relevant credential data
      };
  
      const { error } = await supabase
        .from('user_credentials')
        .insert([{
          user_id: user.id,
          credential: credentialData,
          created_at: new Date().toISOString()
        }]);
  
      if (error) throw error;
      
      message.success("Face ID setup successful!");
    } catch (error) {
      console.error('Error creating credential:', error);
      message.error("Failed to setup Face ID. Please try again.");
    }
  };

  const verifyPasskey = async () => {
    // This here prevents multiple simultaneous auth attempts, its quite important
    if(isAuthenticating) return;

    if (!window.PublicKeyCredential) {
      message.error("Your device doesn't support biometric authentication");
      return;
    }
  
    try {
      setIsAuthenticating(true);
      // First check if the user has registered credentials
      const availableCredentials = await navigator.credentials.get({
        publicKey: {
          challenge: generateRandomChallenge(),
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        }
      });
  
      if (availableCredentials) {
        // Handle successful authentication
        window.localStorage.removeItem('authInProgress');
        message.success("Biometric authentication successful!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      message.error("Authentication failed. Please use PIN instead.");
    } finally {
      setIsAuthenticating(false);
    }

  };



  useEffect(() => {
    const authInProgress = window.localStorage.getItem('authInProgress');
    
    if (user && !authInProgress) {
      // Set flag to prevent multiple auth attempts
      window.localStorage.setItem('authInProgress', 'true');
      
      verifyPasskey().catch(error => {
        console.error("Passkey verification failed:", error);
        // Clear the auth in progress flag on error
        window.localStorage.removeItem('authInProgress');
      });
    }
  
    // Cleanup function to remove auth flag when component unmounts
    return () => {
      window.localStorage.removeItem('authInProgress');
    };
  }, [user]);

  return (
    <PinWrapper>
      <StyledCard>
        <h2>Enter Your PIN</h2>
        <Input.Password
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          maxLength={6}
        />
        <Button type="primary" onClick={handleLogin} block>
          Verify
        </Button>
        <Button type="secondary" onClick={verifyPasskey} block>
          Login with FaceID
        </Button>


      </StyledCard>
    </PinWrapper>
  );
};

export default PinScreen;
