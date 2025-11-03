import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { setThemeColor, resetThemeColor } from "../components/themeColor";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import { FaHome, FaQrcode, FaCog } from "react-icons/fa";


// ICONSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
import carIcon from "./assets/icon.png";
import headerIcon from './assets/NewQueenslandGovernmentBanner.png';
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaGavel, FaAngleLeft } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { VscCreditCard } from "react-icons/vsc";
import { IoLocationSharp } from "react-icons/io5";


// Ewie images
import imgLM1 from './2.0/images-learnmore/1.jpg';
import imgLM2 from './2.0/images-learnmore/2.jpg';
import imgLM3 from './2.0/images-learnmore/3.jpg';
import imgLM4 from './2.0/images-learnmore/4.jpg';
import imgLM5 from './2.0/images-learnmore/5.jpg';
import imgLM6 from './2.0/images-learnmore/6.jpg';

// Random hyperlinks
import streetSmarts from './2.0/images-learnmore/StreetSmarts.jpg';
import translink from './2.0/images-learnmore/Translink.jpg';
import roadRules from './2.0/images-learnmore/RoadRulesQuiz.jpg';

import banner from './2.0/images-learnmore/banner.jpg'




// import Settings from "./Settings";
// import ScanQR from "./ScanQR";
// import DigitalLicense from "./GovID";
// import ShowUserQR from "./2.0/ShowUserQR";
import ChangelogPopup from "../components/versionChangelog";
import { useAuth } from "../components/AuthContext";
// import PullToRefresh from "../components/PullToRefresh";

// lazyload all elements that wont be needed straight away!
const Settings = lazy(() => import("./Settings"));
const ScanQR = lazy(() => import("./ScanQR"));
const DigitalLicense = lazy(() => import("./GovID"));
const ShowUserQR = lazy(() => import("./2.0/ShowUserQR"));



const COLOR_MAROON = "#972541";
const COLOR_BG = "#e7e6ed";
// const COLOR_CARD = "#fff";
const COLOR_YELLOW = "#F1AF5B";
const COLOR_HEADING = "#444";
const COLOR_MUTED = "#666";
const COLOR_TEXT = "#111";
const COLOR_NAV_ACTIVE = "#972541";
const COLOR_NAV_INACTIVE = "#888";
const COLOR_BORDER = "#ccc";

// #region css
// Prevent scroll and set baseline
const NoScrollStyle = createGlobalStyle`
  html, body {
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: ${COLOR_BG};
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    box-sizing: border-box !important;
    overscroll-behavior: none !important;
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

  #root {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`;

const Banner = styled.div`
  position: relative;
  height: 160px;
  background: linear-gradient(120deg, ${COLOR_MAROON} 87%, #a32c4d 100%);
  border-bottom-right-radius: 36px;
  overflow: hidden;
  display: flex;
`;

// keep banner image but ensure it covers and is subtle
const BannerImg = styled.img`
  position: absolute;
  top: -10px;
  height: 110px;
  width: auto + 1px;
  pointer-events: none;
  user-select: none;
`

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

/* Overlap card returned to previous layout so page spacing is unchanged */
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

/* Name / greeting block restored */
const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 6px;
`;

/* Greeting reverted to the previous sizing */
const Greeting = styled.div`
  font-size: 30px;
  color: ${COLOR_TEXT};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  margin: 0;
`;

/* UpdatingRow below greeting (non-absolute) */
const UpdatingRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${COLOR_MUTED};
  gap: 8px;
`;

/* Credentials / ID card restored */
const CredButton = styled.button`
  display: flex;
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 15px;
  width: 95%;
  height: 64px;
  cursor: pointer;
  overflow: hidden;
`;

/* small left badge for ID (keep simple) */
const CredIconSquare = styled.div`
  background: ${COLOR_YELLOW};
  flex: 0 0 58px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 15px 0 0 15px;
  margin-left: -12px;
`;

/* Services container and items reverted to previous form */
const ServicesContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  width: 120%;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
`;

// const ServiceButton = styled.button`
//   background: #fff;
//   border: none;
//   border-radius: 15px;
//   box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
//   width: 100%;
//   height: 54px;
//   margin-right: 0;
//   display: flex;
//   align-items: center;
//   padding: 0 12px;
//   cursor: pointer;
//   overflow: hidden;

//   /* Removal of bottom radius for middle children handled where buttons are grouped in JSX */
//   &:nth-child(2) {
//     border-radius: 12px 12px 0 0;
//   }
//   &:nth-child(5) {
//     border-radius: 0 0 12px 12px;
//   }
// `;

/* small left badge (QLD) */
const ServiceBadge = styled.div`
  background: ${COLOR_MAROON};
  color: #fff;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 8px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
`;

/* icon wrapper */
const ServiceIconImportsOnly = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: ${COLOR_TEXT};
  margin-right: 10px;
`;

/* Button text restored to previous behaviour */
const ButtonText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: ${COLOR_TEXT};
  text-align: left;
  letter-spacing: 0.01em;
  line-height: 1.2;
  flex: 1;
  white-space: normal;
  overflow-wrap: break-word;
  padding: 10px;
`;

/* Learn-more cards reverted to simpler previous variant */
// const InformationButton = styled.button`
//   background: #fff;
//   border: none;
//   border-radius: 12px;
//   box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
//   flex: 0 0 150px;
//   height: 190px;
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
//   padding: 0;
//   cursor: pointer;
//   overflow: hidden;
// `;

/* image area similar to before (top cropped, covers) */
const ServiceImg = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  object-position: top center;
  display: block;
  flex-shrink: 0;
`;

/* caption area kept simple */
const InfoCaption = styled.div`
  padding: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height: 58px;
  text-align:center;
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

const ContentsButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  /* add white background that fits all except for the icon area */
  background: #fff;
  height: fit-content;
`;


const SectionLabel = styled.div`
  font-size: 18px;
  color: ${COLOR_HEADING};
  margin-bottom: 8px;
  letter-spacing: 0.02em;
  font-family: "Arial";
  opacity: 0.7;
`;
const ServiceButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
  width: 85%;
  height: 54px;
  margin-right: 12px;
  display: flex; /* Ensure children are displayed inline */
  align-items: center; /* Center content vertically */
  padding: 0 12px; /* Add padding for spacing */
  margin-bottom: 1px;
  cursor: pointer;

  // Removal of bottom radius
  &:nth-child(2) {
    border-radius: 12px 12px 0 0;/* Top corners rounded, bottom corners square */
  }
  &:nth-child(5) {
    border-radius: 0 0 12px 12px; /* Bottom corners rounded, top corners square */
  }

  /* This creates seemless effect between Buttons 1, 2, 3 on Services */
  &:nth-child(3),
  &:nth-child(4) {
    border-radius: 0; /* Remove border-radius */
    border-bottom: 1px solid ${COLOR_BG}; /* Add bottom border */
  }
  overflow: hidden;

`;


// const ServiceIconImportsOnly = styled.div`
//   display: flex;
//   align-items: center; /* Vertically align the icon with the text */
//   justify-content: center; /* Center the icon horizontally */
//   width: 36px; /* Match the size of the text */
//   height: 36px; /* Match the size of the text */
//   font-size: 16px; /* Match the font size of the text */
//   color: ${COLOR_TEXT}; /* Ensure the icon color matches the text */
//   margin-right: 10px; /* Add spacing between the icon and the text */
// `;
 // default font for ios and android

// const ButtonText = styled.span`
//   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
//   font-size: 16px;
//   color: ${COLOR_TEXT};
//   text-align: left;
//   padding-left: 8px;
//   letter-spacing: 0.01em;
//   flex-wrap: wrap; /* Allow wrapping */
//   white-space: normal; /* Allow text to break into multiple lines */
//   word-wrap: break-word; /* Break long words if necessary */
//   overflow-wrap: break-word; /* Ensure long words wrap properly */
//   margin: 3.5px;
  
// `;

const LearnMoreAbout = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  overflow-y: hidden;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;  

const HorizontalScrollingContainer = styled.div`
  display: flex;
  overflow-x: auto; /* Enable horizontal scrolling */
  overflow-y: hidden; /* Prevent vertical scrolling */
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  margin-top: 12px;
  gap: 12px; /* Add spacing between items */

  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for WebKit browsers */
  }
`;

const InformationButton = styled.button`
  position: relative; /* Add this to establish positioning context */
  background: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
  flex: 0 0 150px; /* Fixed width for each button */
  height: 200px; /* Fixed height for uniformity */
  display: flex;
  flex-direction: column; /* Stack icon and text vertically */
  align-items: stretch; 
  justify-content: flex-start; 
  padding: 0;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(20, 10, 35, 0.15); /* Slightly larger shadow on hover */
    transform: translateY(-2px); /* Slight lift on hover */
    transition: all 0.2s ease-in-out; /* Smooth transition */
  }

  &:hover .chevron-icon {
    opacity: 0.8; /* Slightly more visible on hover */
    transform: scale(1.1); /* Slight scale on hover */
  }
`;

const ChevronBtmCorner = styled.span`
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 15; /* Higher z-index to appear above content */
  font-size: 12px;
  color: ${COLOR_TEXT};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  pointer-events: none; /* keeps the chevron visible but non-interactive */
  transition: all 0.2s ease; /* Smooth transitions */
  opacity: 1;
`;

// Also update the ButtonText in the learn more section to not interfere
const LearnMoreButtonText = styled(ButtonText)`
  padding: 10px 20px 40px 10px; /* Add bottom padding to avoid overlap with icon */
  font-size: 14px; /* Slightly smaller for learn more cards */
  line-height: 1.3;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  display: flex;
  width: 100%;
  border: 0;
  text-transform: capitalize;
`;

const HyperlinkGroup = styled.div`
  margin: 14px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const HyperlinkButton = styled.button`
  position: relative;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
`;

const HyperlinkImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 1;
`;

//#endregion

/* POTENTIAL REVERT - commented duplicate/unused nav styled-components (keep for reference)
   Uncomment only if you plan to replace the Navbar component with these.
*/
/*
const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 92px;
  background: #fff;
  border-top: 1.5px solid ${COLOR_BORDER};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
  width: 100vw;

  & > button {
    font-size: 20px;
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
*/

// ----------- PAGE CONTENT -----------
// FIX: All hooks must always be called in the same order and count, regardless of navigation.
// Do NOT put hooks in conditional branches.
// Solution: Move all hooks to the top-level of the component.

const DashboardWOP = React.memo(function DashboardWOP({ navigateTo }) {
  const navigate = useNavigate();
  const { userData } = useAuth(); // Get user data from context

  // Smart loading states for different types of content
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    // Set theme color and page background for this page; restore on unmount
    const prevBodyBg = document.body.style.backgroundColor;
    setThemeColor(COLOR_MAROON);
    document.body.style.backgroundColor = COLOR_BG;

    return () => {
      resetThemeColor();
      document.body.style.backgroundColor = prevBodyBg || "";
    };
  }, []);

  // Check if user data is loaded
  useEffect(() => {
    if (userData) {
      setUserDataLoaded(true);
      
      // Preload user photo if it exists
      if (userData.photo) {
        const img = new Image();
        img.onload = () => console.log('User photo preloaded');
        img.onerror = () => console.log('User photo failed to load');
        img.src = userData.photo;
      }
    }
  }, [userData]);

  // Preload all assets and components
  useEffect(() => {
    let cancelled = false;

    const preloadAssets = async () => {
      try {
        // 1. Preload dashboard images
        const dashboardImages = [
          banner, 
          imgLM1, imgLM2, imgLM3, imgLM4, imgLM5, imgLM6, 
          carIcon, 
          headerIcon,
          streetSmarts,
          translink,
          roadRules
        ].filter(Boolean);
        
        const imagePromises = dashboardImages.map(src => 
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Don't fail on single image error
            img.src = src;
          })
        );

        await Promise.allSettled(imagePromises);
        if (!cancelled) setImagesLoaded(true);

        // 2. Preload GovID component and its assets
        const govIdModule = await import("./GovID").catch(() => null);
        
        // 3. Preload GovID-specific assets (signatures, background, etc.)
        const govIdAssets = [
          './assets/background.png',
          './assets/qldgov.png',
          './signatures/signature.png',
          './signatures/signature1.png',
          './signatures/signature2.png',
          './signatures/signature3.png',
          './signatures/signature4.png'
        ];

        const govIdImagePromises = govIdAssets.map(src => 
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          })
        );

        await Promise.allSettled(govIdImagePromises);
        if (!cancelled) setAssetsPreloaded(true);

      } catch (error) {
        console.log('Asset preloading completed with some errors:', error);
        if (!cancelled) {
          setImagesLoaded(true);
          setAssetsPreloaded(true);
        }
      }
    };

    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => {
        if (!cancelled) preloadAssets();
      }, { timeout: 2000 });
      
      return () => {
        cancelled = true;
        if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        if (!cancelled) preloadAssets();
      }, 100);
      
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, []);

  // Show loading screen only if critical data isn't ready
  const isLoading = !userDataLoaded || !imagesLoaded;

  if (isLoading) {
    return (
      <LoadingScreen>
        <LoadingFont>
          {!userDataLoaded ? 'Preparing your dashboard...' : 'Fetching your digital wallet...'}
        </LoadingFont>
        <Spinner />
      </LoadingScreen>
    );
  }

  return (
    <>
      <NoScrollStyle />
      <ChangelogPopup />
      <Banner>
        <BannerImg 
          src={banner} 
          alt="banner"
          style={{ 
            opacity: imagesLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}
        />
      </Banner>

      <SafeArea>
        <OverlapCard>
          <ProfileRow>
            <NameBlock>
              <Greeting>
                Good {new Date().getHours() < 12 ? "morning" : "evening"}
                {userData?.firstName && `, ${userData.firstName}`}
              </Greeting>
            </NameBlock>
          </ProfileRow>

          <CredButton onClick={() => navigate("/id")}>
            <CredIconSquare>
              <CarIcon 
                src={carIcon} 
                alt=""
                style={{ 
                  opacity: imagesLoaded ? 1 : 0.5,
                  transition: 'opacity 0.3s ease'
                }}
              />
            </CredIconSquare>
            <ContentsButton>
              <CredText>Driver Licence</CredText>
              <Chevron style={{ marginLeft: 'auto' }}>&#8250;</Chevron>
            </ContentsButton>
          </CredButton>

          {/* Services section with loading states */}
          <ServicesContainer>
            <SectionLabel>Services</SectionLabel>
            {[
              { icon: VscCreditCard, text: "Check registration status" },
              { icon: MdOutlineAttachMoney, text: "Renew registration" },
              { icon: FaGavel, text: "Pay a fine" },
              { icon: IoLocationSharp, text: "Find a Customer Service Centre" }
            ].map((service, index) => (
              <ServiceButton key={index} style={{ opacity: imagesLoaded ? 1 : 0.7 }}>
                <ServiceIconImportsOnly>
                  <service.icon size='25' color="#363737" />
                </ServiceIconImportsOnly>
                <ButtonText>{service.text}</ButtonText>
                <Chevron style={{ marginLeft: 'auto' }}>
                  <FaExternalLinkAlt size={14} color="#363737" style={{ opacity: '0.5' }} />
                </Chevron>
              </ServiceButton>
            ))}
          </ServicesContainer>

          {/* Learn more section with progressive loading */}
          <LearnMoreAbout>
            <SectionLabel>Learn more about</SectionLabel>
            <HorizontalScrollingContainer>
              {[
                { img: imgLM1, title: `Security & \nPrivacy of\nyour\ninformation` },
                { img: imgLM2, title: `The Digital\nLicense app` },
                { img: imgLM3, title: `The\nQueensland\nDigital\nIdentity` },
                { img: imgLM4, title: `Plan for\nsevere\nweather` },
                { img: imgLM5, title: `Travelling\nwith my\ndigital license` },
                { img: imgLM6, title: `TMR online\nservices` }
              ].map((item, index) => (
                <InformationButton key={index}>
                  <ServiceImg 
                    src={item.img} 
                    alt={item.title}
                    loading="lazy" 
                    decoding="async"
                    style={{ 
                      opacity: imagesLoaded ? 1 : 0.3,
                      transition: 'opacity 0.5s ease',
                      backgroundColor: '#f0f0f0' // Placeholder background
                    }}
                  />
                  <ButtonText>{item.title}</ButtonText>
                  <ChevronBtmCorner>
                    <FaExternalLinkAlt size={12} color="#363737" />
                  </ChevronBtmCorner>
                </InformationButton>
              ))}
            </HorizontalScrollingContainer>
            <ViewAllButton>
              <CredText style={{ fontWeight: 500, textAlign: 'center', marginTop: '6px', color: {COLOR_MAROON} }}>VIEW ALL</CredText>
              <Chevron style={{ marginLeft: 'auto' }}>&#8250;</Chevron>
            </ViewAllButton>
          </LearnMoreAbout>

          {/* Hyperlink buttons section */}
          <HyperlinkGroup>
            {/* StreetSmarts - Dark background with yellow/lime text */}
            <HyperlinkButton style={{ opacity: imagesLoaded ? 1 : 0.7, marginBottom: '12px' }}>
              <HyperlinkImg 
                src={streetSmarts} 
                alt="Street Smarts"
                loading="lazy"
                style={{ 
                  opacity: imagesLoaded ? 1 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}
              />
              <ChevronBtmCorner>
                <FaExternalLinkAlt size={14} color="#ffffff" />
              </ChevronBtmCorner>
            </HyperlinkButton>

            {/* Translink - Dark navy background with white text and pink logo */}
            <HyperlinkButton style={{ marginBottom: '12px'}}>
              <HyperlinkImg 
                src={translink} 
                alt="Translink"
                loading="lazy"
                style={{ 
                  opacity: imagesLoaded ? 1 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}
              />
              <ChevronBtmCorner>
                <FaExternalLinkAlt size={14} color="#ffffff" />
              </ChevronBtmCorner>
            </HyperlinkButton>


            {/* Road Rules Refresher Quiz - Blue background with white text */}
            <HyperlinkButton style={{ opacity: imagesLoaded ? 1 : 0.7 }}>
              <HyperlinkImg 
                src={roadRules} 
                alt="Road Rules Refresher Quiz"
                loading="lazy"
                style={{ 
                  opacity: imagesLoaded ? 1 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}
              />
              <ChevronBtmCorner>
                <FaExternalLinkAlt size={14} color="#ffffff" />
              </ChevronBtmCorner>
            </HyperlinkButton>
          </HyperlinkGroup>
        </OverlapCard>
      </SafeArea>
    </>
  );
});

// ----------- MAIN PAGE COMPONENT -----------



// Update the main HomePage component
export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("Home");
  const navigate = useNavigate();

  // Preload GovID component when it's likely to be needed
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      import("./GovID").catch(() => {});
    }, 2000); // Preload after 2 seconds

    return () => clearTimeout(preloadTimer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <DashboardWOP navigateTo={setCurrentPage} />;
      case "Scan QR":
        return (
          <Suspense fallback={<LoadingScreen><Spinner/></LoadingScreen>}>
            <ScanQR />
          </Suspense>
        );
      case "Settings":
        return (
          <Suspense fallback={<LoadingScreen><Spinner/></LoadingScreen>}>
            <Settings />
          </Suspense>
        );
      case "GovID":
        return <DigitalLicense navigateTo={setCurrentPage} />; // Removed Suspense for faster loading
      case "ShowQR":
        return (
          <Suspense fallback={<LoadingScreen><Spinner/></LoadingScreen>}>
            <ShowUserQR navigateTo={setCurrentPage} />
          </Suspense>
        );
      default:
        return <DashboardWOP navigateTo={setCurrentPage} />;
    }
  };

  return (
    <div style={{ width: "100vw", maxWidth: "100vw", boxSizing: "border-box" }}>
      {renderPage()}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

// Remove the separate goToId function and update the onClick to use navigateTo directly
// This avoids route navigation and uses component state instead

/* --- Add minimal UI pieces to resolve undefined-symbol errors --- */
/* These are lightweight, safe defaults — keep or replace with your full implementations. */

const ProfileRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 6px;
`;

const CarIcon = styled.img`
  width: 40px;
  height: auto;
  object-fit: contain;
  display: block;
`;

const CredText = styled.span`
  font-size: 21px;
  color: ${COLOR_TEXT};
  flex: 1;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  margin-left: 12px;
  letter-spacing: 0.01em;
  white-space: normal;
  overflow-wrap: break-word;
`;

const Chevron = styled.span`
  font-size: 32px;
  color: ${COLOR_TEXT};
  margin-left: 8px;
  align-items: center;
`;

/* simple spinner used in multiple places */
const Spinner = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid rgba(0,0,0,0.08);
  border-top-color: rgba(0,0,0,0.35);
  animation: spin 1s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
