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
      createPasskey();
    }
  };

  const generateRandomChallenge = () => {
    // Face ID Auth
    let length = 32;
    let randomValues = new Uint8Array(length);

    window.crypto.getRandomValues(randomValues);
    return randomValues;
  };

  const createPasskey = async () => {
    if(!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get) {
      return alert('Your mobile device does not support FaceID Authententication');
    }

    let credentials = await navigator.credentials.create({
      publicKey: {
        challenge: generateRandomChallenge(),
        rp: { name: "Digital License", id: window.location.hostname },
        // User info
        user: { id: new TextEncoder().encode(user.id), name: user.email, displayName: userData.firstname },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        timeout: 6000,
        authenticatorSelection: { residentKey: 'preferred', requireResidentKey: false, userVerification: 'preferred'},
        attestation: 'none',
        extensions: { credProps: true }
      }
    });

    window.currentPasskey = credentials;
    console.log(credentials);
  }

  const verifyPasskey = async () => {
    try {
      if (!user) return;

      // Check if user has a passkey
      let passkeyExists = await navigator.credentials.get({
        publicKey: {
          challenge: generateRandomChallenge(),
          allowCredentials: [{ type: "public-key", id: new TextEncoder().encode(user.id) }],
        },
      });

      if (passkeyExists) {
        console.log(passkeyExists);
        alert("Biometric authentication successful!");
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      // No passkey found or an error occurred, so user will enter PIN manually
    }
  };



  useEffect(() => {
    if (user) {
      verifyPasskey();
    }
  }, [user])

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


      </StyledCard>
    </PinWrapper>
  );
};

export default PinScreen;
