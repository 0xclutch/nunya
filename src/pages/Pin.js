import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import { supabase } from "../components/supabaseClient";

const PinWrapper = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  font-family: 'SF Pro Display', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
`;

const LockIcon = styled(Box)`
  font-size: 48px; /* smaller icon, matches photo lock size */
  color: #7B2B7A;
`;

const Title = styled(Typography)`
  font-size: 20px;
  font-weight: 500;
  color: #7B2B7A;
  letter-spacing: 0;
  margin: 0;
`;

const PinInputContainer = styled(Box)`
  display: flex;
  gap: 5px; /* spacing between PIN boxes */
`;

const PinField = styled(Box)`
  width: 37px;
  height: 52px;
  border: 2px solid #7B2B7A;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;  /* space from top to icon */
  padding-bottom: 40px; /* space from bottom of content */
  width: 100%;
`;

const PinDot = styled(Typography)`
  font-size: 70px;
  color: #7B2B7A;
`;

const ResetText = styled(Box)`
  font-size: 16px;
  color: #777777;
  margin-top: 48px; /* space above reset text */
  font-weight: 400;
`;

const ResetLink = styled.span`
  color: #7B2B7A;
  font-weight: 700;
  margin-left: 6px;
  cursor: pointer;
  user-select: none;
`;

const KeypadWrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 90vw;
  padding: 20px 32px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: -10px 10px;
  background-color: #fefbfc;
  border-top: 2px solid #e0dce1;
`;

const StaticObjects = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;  /* space between icon, text, and pin inputs */
`;

const KeyButton = styled.button`
  height: 70px;
  font-size: 35px;
  color: black;
  background-color: #fefbfc;
  border: none;
  border-radius: 10px;
  font-family: 'SF Pro Display', sans-serif;
  touch-action: manipulation; /* improve tap response */
  user-select: none;  
  &:active {
    background-color: #f3f3f3;
  }
`;

const DeleteButton = styled(KeyButton)`
  color: #7B2B7A;
  font-size: 24px;
`;

const PinScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [storedPin, setStoredPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const pinRefs = useRef([]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function initAuth() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('pin')
          .eq('uuid', user.id)
          .single();

        if (error) throw error;

        if (!data?.pin || data.pin.length !== 6) {
          throw new Error("Invalid pin configuration");
        }

        if (isMounted) {
          setStoredPin(data.pin);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          showMessage("Error loading PIN", "error");
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const showMessage = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message: message, severity: severity });
  }, []);

  const handleKeyPress = (key) => {
    if (key === "⌫") return handleDelete();
    const index = pin.findIndex((val) => val === "");
    if (index !== -1) {
      const updated = [...pin];
      updated[index] = key;
      setPin(updated);
      if (updated.join("").length === 6) handleSubmit(updated.join(""));
    }
  };

  const handleDelete = () => {
    const index = pin.findLastIndex((val) => val !== "");
    if (index !== -1) {
      const updated = [...pin];
      updated[index] = "";
      setPin(updated);
    }
  };

  const handleSubmit = (value) => {
    if (value === storedPin) {
      showMessage("PIN verified", "success");
      navigate("/dashboard");
    } else {
      showMessage("Incorrect PIN", "error");
      setPin(["", "", "", "", "", ""]);
    }
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PinWrapper>
      <ContentContainer>
        <StaticObjects>
          <LockIcon>
            <span role="img" aria-label="lock">🔒</span>
          </LockIcon>
          <Title>Enter your 6 digit PIN</Title>

          <PinInputContainer>
            {pin.map((val, i) => (
              <PinField key={i}>
                <PinDot>{val ? "•" : ""}</PinDot>
              </PinField>
            ))}
          </PinInputContainer>
        </StaticObjects>

        <ResetText>
          Forgot your PIN?
          <ResetLink> RESET</ResetLink>
        </ResetText>
      </ContentContainer>

      <KeypadWrapper>
        {keypad.map((key, i) => (
          <KeyButton key={i} onClick={() => handleKeyPress(key)} disabled={!key}>
            {key}
          </KeyButton>
        ))}
      </KeypadWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PinWrapper>
  );
};

export default PinScreen;
