import { useState, useEffect, useRef, useCallback } from "react";
import { setThemeColor, resetThemeColor } from "../components/themeColor";
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

//#region Styling Components

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

//#endregion

const PinScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [storedPin, setStoredPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });


  // Preloading the storedPin ASAP
  useEffect(() => {
    resetThemeColor();
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('pin')
          .eq('uuid', user.id)
          .single();

        if (error) throw error;
        if (!data?.pin || data.pin.length !== 6) throw new Error("Invalid pin configuration");
        if (mounted) setStoredPin(data.pin);
      } catch (err) {
        setSnackbar({ open: true, message: "Error loading PIN", severity: "error" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // 2. INSTANTANEOUS PIN BUTTON HANDLER
  // - Use useRef for pin to avoid async setState lag
  const pinRef = useRef(pin);
  pinRef.current = pin;

  const handleKeyPress = useCallback((key) => {
    if (key === "⌫") {
      // Delete logic (instant)
      const idx = pinRef.current.findLastIndex((val) => val !== "");
      if (idx !== -1) {
        const updated = pinRef.current.slice();
        updated[idx] = "";
        setPin(updated);
        pinRef.current = updated;
      }
      return;
    }
    // Find first empty
    const idx = pinRef.current.findIndex((val) => val === "");
    if (idx !== -1 && /^[0-9]$/.test(key)) {
      const updated = pinRef.current.slice();
      updated[idx] = key;
      setPin(updated);
      pinRef.current = updated;
      // Submit if complete
      if (idx === 5) {
        // Fast: allow button mashing, do not block UI
        if (updated.join("") === storedPin) {
          setTimeout(() => {  // allow render before navigation
            setSnackbar({ open: true, message: "PIN verified", severity: "success" });
            navigate("/dashboard");
          }, 10);
        } else {
          setSnackbar({ open: true, message: "Incorrect PIN", severity: "error" });
          setTimeout(() => {
            setPin(["", "", "", "", "", ""]);
            pinRef.current = ["", "", "", "", "", ""];
          }, 120); // short delay so user sees "full" pin
        }
      }
    }
  }, [navigate, storedPin]);
  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  const showMessage = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message: message, severity: severity });
  }, []);  

  const handleSubmit = (value) => {
    if (value === storedPin) {
      showMessage("PIN verified", "success");
      navigate("/dashboard");
    } else {
      showMessage("Incorrect PIN", "error");
      setPin(["", "", "", "", "", ""]);
    }
  };


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
          <ResetLink>RESET</ResetLink> {/* This link should be updated to allow the user the ability to reset it :) */}
        </ResetText>
      </ContentContainer>

      <KeypadWrapper>
        {keypad.map((key, i) => (
          <KeyButton key={i} onPointerDown={key ? (e) => {e.preventDefault(); handleKeyPress(key); } : undefined}
            disabled={!key}
            tabIndex={-1} // prevent focus
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          >{key}</KeyButton>
        ))}
      </KeypadWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1800}
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
