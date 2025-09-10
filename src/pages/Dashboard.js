import { useAuth } from "../components/AuthContext";
import { resetThemeColor, setThemeColor } from "../components/themeColor";
import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PullToRefresh from "../components/PullToRefresh";

import carIcon from "./assets/icon.png";
import headerIcon from './assets/qldgov.png';
import OverlappingProfileCard from "../components/OverlappingProfileCard";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Settings from "./Settings";
import ScanQR from "./ScanQR";
import DigitalLicense from "./GovID";
import HelpButton from "../components/HelpButton";



const COLOR_MAROON = "#972541";
const COLOR_BG = "#e7e6ed";
const COLOR_YELLOW = "#F1AF5B";
const COLOR_HEADING = "#444";
const COLOR_MUTED = "#666";
const COLOR_TEXT = "#111";
const COLOR_NAV_ACTIVE = "#972541";
const COLOR_NAV_INACTIVE = "#888";
const COLOR_BORDER = "#ccc";

// Prevent scroll and set baseline
const NoScrollStyle = createGlobalStyle`
  html, body {
    overflow: hidden !important; /* Prevent both vertical and horizontal scrolling */
    overflow-x: hidden !important; /* Specifically prevent horizontal scrolling */
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: ${COLOR_BG};
    font-family: 'SF Pro Display', 'Roboto', 'Arial', sans-serif;
    box-sizing: border-box !important;
    overscroll-behavior: none !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${COLOR_TEXT};
    font-size: 16px;
    line-height: 1.5; 
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
`;

const Banner = styled.div`
  position: relative;
  width: 100vw;
  height: 180px;
  background: linear-gradient(120deg, ${COLOR_MAROON} 87%, #a32c4d 100%);
  border-bottom-right-radius: 36px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

const BannerContent = styled.div`
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Crest = styled.img`
  width: 90px;
  height: auto;
  transform: scale(1.5);
  margin-bottom: 15px;
  padding: 0 23px 35px 0;
`;

const BannerTitle = styled.div`
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.1px;
`;

const BannerSub = styled.div`
  color: #fff;
  font-size: 15px;
  line-height: 1.1;
`;

const OverlapCard = styled.div`
  position: relative;
  background: ${COLOR_BG};
  border-radius: 18px;
  width: calc(100vw - 32px);
  max-width: 420px;
  margin: -62px auto 0 auto;
  padding: 25px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const ProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 130px;
  border-radius: 8px;
  object-fit: cover;
  background: #eee;
  margin-right: 18px;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 60px;
  width: calc(100% - 120px);
  margin-bottom: 73px;
`;

const Name = styled.div`
  font-size: 20px;
  color: ${COLOR_TEXT};
  font-weight: 400;
  margin-bottom: 2px;
  text-transform: none;
  letter-spacing: 0.01em;
`;

const LastName = styled.div`
  font-size: 24px;
  color: ${COLOR_TEXT};
  font-weight: 700;
  text-transform: uppercase;
`;

const SectionLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${COLOR_HEADING};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const UpdatingRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${COLOR_MUTED};
  font-weight: 400;
  margin-bottom: 13px;
  margin-left: 2px;
  gap: 7px;
`;

const Dot = styled.span`
  font-size: 23px;
  font-weight: 700;
  color: ${COLOR_MUTED};
  margin-right: 3px;
  line-height: 6px;
`;

const Spinner = styled.div`
  border: 2.2px solid #ddd;
  border-top: 2.2px solid ${COLOR_MUTED};
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.85s linear infinite;
  @keyframes spin { to { transform: rotate(360deg);} }
`;

const CredButton = styled.button`
  display: flex;
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0 1.5px 8px rgba(20,10,35,0.07);
  width: 100%;
  min-height: 66px;
  margin: 8px 0 0 0;
  padding: 0 18px 0 10px;;
  cursor: pointer;
  outline: none;
`;

const CredIconCircle = styled.div`
  background: ${COLOR_YELLOW};
  width: 40px;
  height: 40px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const CarIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const CredText = styled.span`
  font-size: 19px;
  font-weight: 400;
  color: ${COLOR_TEXT};
  flex: 1;
  text-align: left;
`;

const Chevron = styled.span`
  font-size: 28px;
  color: #111;
  margin-left: 7px;
  margin-right: 2px;
  line-height: 1;
  user-select: none;
`;

// --- LOADING SCREEN ---
const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${COLOR_BG};
  color: ${COLOR_MUTED};
`;

const LoadingFont = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 28px;
  color: ${COLOR_HEADING};
  letter-spacing: 0.02em;
  font-family: 'SF Pro Display', 'Roboto', 'Arial', sans-serif;
  text-align: center;
  line-height: 1.3;
`;

const SafeArea = styled.div`
  padding-bottom: 110px;
  min-height: 100vh;
  background: ${COLOR_BG};
`;

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 92px; /* Increased height */
  background: #fff;
  border-top: 1.5px solid ${COLOR_BORDER};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
  width: 100vw;

  /* Increase icon size and button area */
  & > button {
    font-size: 20px; /* Larger icon size */
    min-width: 90px;
    min-height: 92px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => active ? COLOR_NAV_ACTIVE : COLOR_NAV_INACTIVE};
  font-size: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  outline: none;
  padding: 0 0 4px 0;
`;

const NavLabel = styled.span`
  font-size: 12px;
  color: ${({ active }) => active ? COLOR_NAV_ACTIVE : COLOR_NAV_INACTIVE};
  font-weight: 400;
  margin-top: 1.5px;
  letter-spacing: 0.04em;
`;

// ----------- PAGE CONTENT -----------
// FIX: All hooks must always be called in the same order and count, regardless of navigation.
// Do NOT put hooks in conditional branches.
// Solution: Move all hooks to the top-level of the component.

function HomePageContent({ navigateTo }) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // Split loading states so hooks are always called in order
  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    resetThemeColor();
    setThemeColor(COLOR_MAROON);
    const t1 = setTimeout(() => setFakeLoading(false), 1200);
    const t2 = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // These are used below, even if not rendered always
  const [isUpdating, setIsUpdating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUpdating(false);
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => { 
    new Promise((resolve) => {
      setTimeout(() => {
        setIsUpdating(true);
      }, 500);
      setTimeout(() => {
        setIsUpdating(false);
        resolve();
      }, 2000);
    });
  };
  // Always call hooks above, only return early here
  if (loading || fakeLoading) {
    return (
      <LoadingScreen>
        <LoadingFont>Fetching your digital wallet</LoadingFont>
        <Spinner />
      </LoadingScreen>
    );
  }

  return (
    <>
      <NoScrollStyle />
      <PullToRefresh
        onRefresh={handleRefresh}
        onPull={setPullDistance}
        style={{
          background: 'none',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <Banner>
          <BannerContent>
            <Crest src={headerIcon} alt="Qld Crest" />
          </BannerContent>
        </Banner>
        <SafeArea>
          <OverlapCard>
            <ProfileRow>
              <OverlappingProfileCard src={userData?.photo}/>
              <NameBlock>
                <Name>
                  {`${userData?.firstname?.toUpperCase() || ""} ${userData?.middlename?.toUpperCase() || ""}`}
                </Name>
                <LastName>{userData?.lastname?.toUpperCase() || ""}</LastName>
              </NameBlock>
            </ProfileRow>
            <SectionLabel>Credentials</SectionLabel>
            {(isUpdating || isLoading) && (
              <UpdatingRow>
                <Spinner style={{ width: 14, height: 14, marginRight: 6 }} />
                Updating
              </UpdatingRow>
            )}
            <CredButton onClick={() => navigate("/id")}>
              <CredIconCircle>
                <CarIcon src={carIcon} alt="" />
              </CredIconCircle>
              <CredText>Driver Licence</CredText>
              <Chevron>&#8250;</Chevron>
            </CredButton>
            {/* <CredButton onClick={() => navigate('/secret')}>
              <Name>Dev Dashboard.js</Name>
            </CredButton> */}
          </OverlapCard>
        </SafeArea>
      </PullToRefresh>
    </>
  );
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("Home");
  const navigate = useNavigate();

  // Do NOT use hooks conditionally!
  // Always call the same hooks, always in the same order.

  useEffect(() => {

    // Checks for page reload
    if(currentPage === "GovID") {
      navigate("/id", { replace: true });
    }
  }, [currentPage, navigate]); // dependency array


  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePageContent navigateTo={setCurrentPage} />;
      case "Scan QR":
        return <ScanQR />;
      case "Settings":
        return null;//<Settings />;
      case "GovID":
        return <DigitalLicense navigateTo={setCurrentPage} />;
      default:
        return <HomePageContent navigateTo={setCurrentPage} />;
    }
  };

  return (
    <div style={{ width: "100vw", maxWidth: "100vw", boxSizing: "border-box" }}>
      {renderPage()}
      {currentPage !== "GovID" && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}