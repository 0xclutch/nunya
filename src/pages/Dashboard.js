import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { createGlobalStyle } from "styled-components";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import { supabase } from "../components/supabaseClient";
import { FaHome, FaQrcode, FaCog } from "react-icons/fa"; // for icons on web
import Settings from "./Settings";
import ScanQR from "./ScanQR";

import icon from './assets/icon.png';

const Container = styled.div`
  background-color: #e7e6ed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1; 
`;

const NoScrollStyle = createGlobalStyle`
  html, body {
    overflow: hidden !important;        /* hide scrollbars */
    height: 100% !important;            /* ensure no extra height */
    touch-action: none !important;      /* prevent touch‑drag */
    overscroll-behavior: contain !important; /* no bounce or parent scroll */
  }
`;
const ContentArea = styled.div`
  flex: 1;             /* take up all remaining space */
  overflow: hidden;    /* clip any excess */
  display: flex;
  flex-direction: column;
`;


const Banner = styled.div`
  background-color: #972541;
  height: 70px;
  flex-shrink: 0;
`;

const SafetyPadding = styled.div`
  padding: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 0px;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 130px;
  border-radius: 8px;
  margin-right: 20px;
  object-fit: cover;
  aspect-ratio: 1;
`;

const LegalNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -50px;
  font-family: 'Arial';
  text-transform: uppercase;
`;

const LegalName = styled.span`
  font-size: 24px;
`;

const Bold = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 15px 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f3;
  }
`;

const ButtonText = styled.span`
  font-size: 18px;
  color: #333;
  margin-left: 20px;
  flex: 1;
  text-align: left;
`;

const IconImage = styled.img`
  width: 35px;
  height: 40px;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 70px);
  background-color: #e7e6ed;
  color: #6a5964;
`;

const LoadingFont = styled.div`
  font-size: 16px;
  margin-bottom: 50px;
`;

const UpdatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
`;

const ActivityIndicator = styled.div`
  border: 3px solid #ccc;
  border-top: 3px solid #666;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
  margin-left: 5px;

  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
`;

function HomePageContent({ navigateTo }) {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const carBroomBroom = icon; // Adjust your public path accordingly

  // Request notification permission (web)
  useEffect(() => {
    if ("Notification" in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Denied notification permission.");
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setTimeout(() => setFakeLoading(false), 2500);
      try {
        if (user && user.id) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("uuid", user.id);

          if (userError) {
            console.error("Error fetching user info:", userError);
          } 
          else if (userData.length > 0) {
            const userInfo = userData[0];
            setFName(userInfo.firstname || "");
            setMName(userInfo.middlename || "");
            setLName(userInfo.lastname || "");
            setProfilePicture(userInfo.photo || null);
          }
        }
      } catch (error) {
          console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();


    // Disable scrolling when login screen is visible
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the component is unmounted or the login process is complete
    return () => {
      document.body.style.overflow = "auto";
    };

  }, [user]);

  const redirectToId = () => {
    if (typeof navigateTo === "function") navigateTo("GovID");
  };

  if (loading)
    return (
      <LoadingScreen>
        <LoadingFont>Loading...</LoadingFont>
      </LoadingScreen>
    );

  return (
    <>
    <NoScrollStyle />
      <Container>
        <Banner />
        {fakeLoading ? (
          <LoadingScreen>
            <LoadingFont>Fetching your digital wallet</LoadingFont>
            <ActivityIndicator />
          </LoadingScreen>
        ) : (
          <SafetyPadding>
            <ProfileContainer>
              {profilePicture && (
                <ProfilePicture src={profilePicture} alt="Profile" />
              )}
              <LegalNameContainer>
                <LegalName>{`${fName} ${mName}`}</LegalName>
                <Bold>{lName}</Bold>
              </LegalNameContainer>
            </ProfileContainer>

            <Header>Credentials</Header>
            <UpdatingContainer>
              <span>Updating</span>
              <ActivityIndicator />
            </UpdatingContainer>
            <Button onClick={redirectToId}>
              <IconImage src={carBroomBroom} alt="Driver's License" />
              <ButtonText>Drivers License</ButtonText>
            </Button>
          </SafetyPadding>
        )}
      </Container>
    </>
  );
}


// Simple tab nav for web - example only
export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("Home");

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePageContent navigateTo={(page) => setCurrentPage(page)} />;
      case "Scan QR":
        return <ScanQR />;
      case "Settings":
        return <Settings />;
      case "GovID":
        return <div>GovID Page Placeholder</div>;
      default:
        return <HomePageContent />;
    }
  };

  return (
    <div>
      {renderPage()}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: 12,
          background: "#fff",
          borderTop: "1px solid #ccc",
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: 70,
          alignItems: "center",
          color: "#94737b",
        }}
      >
        <button
          onClick={() => setCurrentPage("Home")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "Home" ? "#a14e61" : "#94737b",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Home"
        >
          <FaHome />
        </button>
        <button
          onClick={() => setCurrentPage("Scan QR")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "Scan QR" ? "#a14e61" : "#94737b",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Scan QR"
        >
          <FaQrcode />
        </button>
        <button
          onClick={() => setCurrentPage("Settings")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "Settings" ? "#a14e61" : "#94737b",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Settings"
        >
          <FaCog />
        </button>
      </nav>
    </div>
  );
}
