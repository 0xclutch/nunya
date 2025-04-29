import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import styled from "styled-components";
import { supabase } from "../components/supabaseClient";




const PinWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding: 16px;
  background-color: #f5f5f5;
`;
const PinInputContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;
const PinField = styled(TextField)`
  && {
    width: 50px;
    height: 50px;
    font-size: 24px;
    text-align: center;
    background: white;
  }
`;



const PinScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [storedPin, setStoredPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const pinRefs = useRef([]);


  useEffect(() => {
    const initializeAuth = async () => {
      if (!user) return;
      
      // If pin is null or less than 6 characters, return an error
      if (!userData?.pin || userData.pin.length !== 6) {
        const error = new Error("Invalid PIN");
        message.error("Invalid PIN configuration");
        console.error(error);
      }

  
      setStoredPin(userData.pin);
    };

    const startAuthentication = async () => {
      if (!user || isAuthenticating) return;
  
      try {
        await verifyPasskey();
      } catch (error) {
        console.error("Error checking Face ID credential:", error); 
        setShowPinInput(true);
      }
    };

    initializeAuth();
    startAuthentication();

  }, [user, userData]);

  const handleLogin = () => {
    if (pin.join("") === storedPin) {
      message.success("PIN verified!");
      navigate("/dashboard");
    } else {
      message.error("Incorrect PIN. Try again.");
      setPin(["", "", "", "", "", ""]);
      pinRefs.current[0]?.focus();
    }
  };

  const generateRandomChallenge = () => {
    let length = 32;
    let randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return randomValues;
  };


  const generateKey = async () => {
    if (isAuthenticating) {
      return setShowPinInput(true);
    }
  
    if (!window.PublicKeyCredential) {
      message.error("Your device doesn't support biometric authentication");
      return setShowPinInput(true);
    }
  
    try {
      setIsAuthenticating(true);
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

      if (!credential) throw new Error("Credential creation failed.");
  
      // Store the credential in your database
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        type: credential.type,

        // Add any other relevant credential data
      };
  
      const { data, error } = await supabase
        .from("users")
        .update({ user_credentials: credentialData }) // Update user_credentials
        .eq("uuid", user.id) // Ensure it matches the correct user
        .select(); // Return the updated row
    
    
      if (error) {
        throw error;
      } else {
        message.success("Credentials updated successfully!");
      }
    
      message.success("Face ID setup successful!");
    } catch (error) {
      console.error('Error creating credential:', error);
      message.error("Failed to setup Face ID. Please try again.");
    }
  };

  const verifyPasskey = async () => {
    // This here prevents multiple simultaneous auth attempts, its quite important
    if(isAuthenticating || !window.PublicKeyCredential) {
      return setShowPinInput(true);
    }
  
    try {
      setIsAuthenticating(true);

      const { data, error } = await supabase
        .from("users")
        .select("user_credentials")
        .eq("uuid", user.id)
        .single();

      if (error || !data?.user_credentials?.id) {
        console.error("No valid passkey found for user:", user.id);
        message.error("Face ID couldn't verify your identity. Please use PIN instead.");
        setShowPinInput(true);
        return;
      };

      const allowCredentials = [{
        id: new Uint8Array(data.user_credentials.rawId),
        type: 'public-key',
      }];
  
      const challenge = generateRandomChallenge();
  
      const assertionResponse = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
          allowCredentials, // Specify which credentials are allowed
        },
      });
  
      if(!assertionResponse) {
        throw new Error('Face ID Failed');
      }


      // Converting the authentication response so the server can read and understand the shits
      const authData = {
        id: assertionResponse.id,
        rawId: Array.from(new Uint8Array(assertionResponse.rawId)),
        response: {
          authenticatorData: Array.from(new Uint8Array(assertionResponse.response.authenticatorData)),
          clientDataJSON: Array.from(new Uint8Array(assertionResponse.response.clientDataJSON)),
          signature: Array.from(new Uint8Array(assertionResponse.response.signature)),
        },
        type: assertionResponse.type
      };


      const verificationResponse = await supabase.functions.invoke('verify-webauthn', {
        body: {
          credential: authData,
          challenge: Array.from(challenge),
          userId: user.id
        }
      });
  
      if (!verificationResponse.data?.verified) {
        throw new Error('Authentication verification failed');
      }
  
      message.success("Biometric authentication successful!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Authentication error:", error);
      message.error("Authentication failed. Please use PIN instead.");
      setShowPinInput(true);
    } finally {
      setIsAuthenticating(false);
    }
  };



  const handlePinChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      let newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < pin.length - 1) {
        pinRefs.current[index + 1]?.focus();
      }
    }

    if (pin.join("").length === 6) {
      handleLogin();
    }
  }

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  return (
    <PinWrapper>
    {!showPinInput ? (
      <>
        <Typography variant="h5">Authenticating with Face ID...</Typography>
        <Typography variant="body2">If this fails, you'll be prompted to enter your PIN.</Typography>
      </>
    ) : (
      <>
        <Typography variant="h5">Enter Your PIN</Typography>
        <PinInputContainer>
          {pin.map((num, i) => (
            <PinField
              key={i}
              type="password"
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "24px" },
              }}
              value={num}
              onChange={(e) => handlePinChange(i, e.target.value)}
              onKeyDown={(e) => handleBackspace(i, e)}
              inputRef={(el) => (pinRefs.current[i] = el)}
            />
          ))}
        </PinInputContainer>
        <Button onClick={generateKey}>Create new Passkey</Button>
      </>
    )}
  </PinWrapper>
  );
};

export default PinScreen;
