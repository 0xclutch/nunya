import { useAuth } from "../components/AuthContext";
import { resetThemeColor, setThemeColor } from "../components/themeColor";
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import { FaHome, FaQrcode, FaCog } from "react-icons/fa";


// ICONSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
import carIcon from "./assets/icon.png";
import headerIcon from './assets/NewQueenslandGovernmentBanner.png';
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaGavel, FaCreditCard  } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";


// Ewie images
import imgLM1 from './2.0/images-learnmore/1.jpg';
import imgLM2 from './2.0/images-learnmore/2.jpg';
import imgLM3 from './2.0/images-learnmore/3.jpg';
import imgLM4 from './2.0/images-learnmore/4.jpg';
import imgLM5 from './2.0/images-learnmore/5.jpg';
import imgLM6 from './2.0/images-learnmore/6.jpg';

import banner from './2.0/images-learnmore/banner.jpg'




// import Settings from "./Settings";
// import ScanQR from "./ScanQR";
// import DigitalLicense from "./GovID";
// import ShowUserQR from "./2.0/ShowUserQR";
import ChangelogPopup from "../components/versionChangelog";
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
    -webkit-font-smoothing: antialiased;
    
  }
`;

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(96px, 14vh, 120px); /* smaller mobile-friendly header */
  background: linear-gradient(180deg, ${COLOR_MAROON} 0%, #7b1e3a 100%);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  z-index: 80;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
`;

// keep banner image but ensure it covers and is subtle
const BannerImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  width: auto;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  opacity: 0.12; /* subtle overlay so text and crest stay readable */
  pointer-events: none;
  user-select: none;
`

const BannerContent = styled.div`
  position: absolute;
  left: 20px; /* moved closer to left now */
  bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none;
`;


// const BannerTitle = styled.div`
//   color: #fff;
//   font-size: 17px;
//   font-weight: 600;
//   line-height: 1.1;
//   letter-spacing: 0.1px;
// `;

// const BannerSub = styled.div`
//   color: #fff;
//   font-size: 15px;
//   line-height: 1.1;
// `;

const OverlapCard = styled.div`
  position: relative;
  background: ${COLOR_BG};
  width: calc(100vw - 32px);
  max-width: 420px;
  margin: clamp(88px, 14vh, 120px) auto 0 auto; /* aligned with banner height */
  padding: 18px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  border-radius: 12px;
`;

const ProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// const ProfilePicture = styled.img`
//   width: 100px;
//   height: 130px;
//   border-radius: 8px;
//   object-fit: cover;
//   background: #eee;
//   margin-right: 18px;
// `;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 12px;
  gap: 6px;
`;

const Greeting = styled.div`
  font-size: 28px; /* bold and prominent */
  color: ${COLOR_TEXT};
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.01em;
`;

/* UpdatingRow flows below greeting, not absolute */
const UpdatingRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${COLOR_MUTED};
  gap: 8px;
`;

/* ID card: taller, cleaner */
const CredButton = styled.button`
  display: flex;
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 12px;
  width: 100%;
  height: 64px;
  margin: 8px 0 12px 0;
  padding: 8px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(20,10,35,0.06);
`;

/* small left badge for ID */
const CredIconSquare = styled.div`
  background: ${COLOR_YELLOW};
  width: 56px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
`;

/* Services list */
const ServicesContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

/* cleaner service items: white cards with small left badge/icon */
const ServiceButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(20,10,35,0.04);
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  gap: 12px;
`;

/* badge on the left (QLD label style) */
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
`;

/* ensure text wraps and aligns left */
const ButtonText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: ${COLOR_TEXT};
  text-align: left;
  letter-spacing: 0.01em;
  line-height: 1.2;
  flex: 1;
`;

/* Learn-more cards: image-top with rounded top corners, text area below */
const InformationButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(20,10,35,0.06);
  flex: 0 0 150px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
`;

/* image fills left/right/top, rounded only at top */
const ServiceImg = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 12px 12px 0 0;
`;

/* caption area */
const InfoCaption = styled.div`
  padding: 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height: 58px;
  text-align:center;
`;

/* small external link icon bottom-right (no border) */
const ChevronBtmCorner = styled.span`
  font-size: 12px;
  color: rgba(0,0,0,0.5);
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: transparent;
  padding: 4px;
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

const ServicesContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  overflow-y: hidden;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

`;

const SectionLabel = styled.div`
  font-size: 18px;
  color: ${COLOR_HEADING};
  margin-bottom: 12px;
  letter-spacing: 0.02em;
  font-family: "Arial";
  opacity: 0.7;
`;
const ServiceButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
  width: 100%;
  height: 54px;
  margin-right: 12px;
  display: flex; /* Ensure children are displayed inline */
  align-items: center; /* Center content vertically */
  padding: 0 12px; /* Add padding for spacing */
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

const ServiceIcon = styled.img`
  width: 36px;
  height: 36px;
  margin: 14px;
`;
const ServiceIconImportsOnly = styled.div`
  display: flex;
  align-items: center; /* Vertically align the icon with the text */
  justify-content: center; /* Center the icon horizontally */
  width: 36px; /* Match the size of the text */
  height: 36px; /* Match the size of the text */
  font-size: 16px; /* Match the font size of the text */
  color: ${COLOR_TEXT}; /* Ensure the icon color matches the text */
  margin-right: 10px; /* Add spacing between the icon and the text */
`;
 // default font for ios and android

const ButtonText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: ${COLOR_TEXT};
  text-align: left;
  padding-left: 8px;
  letter-spacing: 0.01em;
  flex-wrap: wrap; /* Allow wrapping */
  white-space: normal; /* Allow text to break into multiple lines */
  word-wrap: break-word; /* Break long words if necessary */
  overflow-wrap: break-word; /* Ensure long words wrap properly */
  margin: 3.5px;
  
`;

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
  background: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1.5px 8px rgba(20, 10, 35, 0.07);
  flex: 0 0 150px; /* Fixed width for each button */
  height: 190px; /* Fixed height for uniformity */
  display: flex;
  flex-direction: column; /* Stack icon and text vertically */
  align-items: stretch; 
  justify-content: flex-start; 
  padding: 0;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(20, 10, 35, 0.15); /* Slightly larger shadow on hover */
    transform: translateY(-2px); /* Slight lift on hover */
    transition: all 0.2s ease-in-out; /* Smooth transition */
  }
  overflow: hidden;
`;
// make this fill the container fully at the top half
const ServiceImg = styled.img`
  width: 100%;
  height: 110px; /* image area height, adjust as needed */
  object-fit: cover; /* fill and crop as needed */
  object-position: top center; /* align crop to top */
  display: block;
  flex-shrink: 0;
`
  


const ChevronBtmCorner = styled.span`
  font-size: 10px;
  color: #111;
  margin-left: auto; /* Push the icon to the far right */
  margin-top: auto;
  margin-right: 6px;
  display: flex;
  padding: 5px;
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

const DashboardWOP = React.memo(function DashboardWOP({ navigateTo }) {
  const navigate = useNavigate();

  // Split loading states so hooks are always called in order
  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const splashScreenDuration = 3000;
  const howlongshoulditloadfor = 3500;

  useEffect(() => {
    // Set theme color for the page
      resetThemeColor();
      setThemeColor(COLOR_MAROON);
  }, []);

  useEffect(() => {
    // non-blocking splash + image warming using idle time
    let cancelled = false;

    // Keep splash for minimum time
    const minSplash = setTimeout(() => {
      if (!cancelled) setFakeLoading(false);
    }, splashScreenDuration);

    // Warm images on idle to avoid main-thread blocking
    const imagesToWarm = useMemo
      ? ( () => ([banner, imgLM1, imgLM2, imgLM3, imgLM4, imgLM5, imgLM6, carIcon, headerIcon].filter(Boolean)) )()
      : [banner, imgLM1, imgLM2, imgLM3, imgLM4, imgLM5, imgLM6, carIcon, headerIcon].filter(Boolean);

    const warmImages = () => {
      imagesToWarm.forEach((src) => {
        try {
          const img = new Image();
          img.src = src;
          // use decode where supported so browser can do async decoding
          if (img.decode) img.decode().catch(() => {});
        } catch (_) {}
      });
    };

    // Prefer requestIdleCallback; fallback to setTimeout
    if ('requestIdleCallback' in window) {
      const id = (window).requestIdleCallback(() => { if (!cancelled) warmImages(); }, { timeout: 2000 });
      // after warming, reveal content (but don't block longer than maxWait)
      const reveal = setTimeout(() => { if (!cancelled) setLoading(false); }, 2500);
      return () => { cancelled = true; clearTimeout(minSplash); clearTimeout(reveal); (window).cancelIdleCallback && (window).cancelIdleCallback(id); };
    } else {
      const id = setTimeout(() => { if (!cancelled) warmImages(); }, 400);
      const reveal = setTimeout(() => { if (!cancelled) setLoading(false); }, 2500);
      return () => { cancelled = true; clearTimeout(minSplash); clearTimeout(id); clearTimeout(reveal); };
    }
  }, []);

  // These are used below, even if not rendered always
  const [isUpdating, setIsUpdating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { // Text visual "Loading..." timer
      setIsUpdating(false);
      setIsLoading(false);
    }, howlongshoulditloadfor);
    return () => clearTimeout(timer);
  }, []);

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
      <ChangelogPopup />  {/* It's exactly what you think! Changelog updater!!! Woahhh*/} 
        <Banner>
          <BannerImg src={banner} alt="banner" />
            <BannerContent>
            </BannerContent>
        </Banner>

        <SafeArea>
            <OverlapCard>
              <ProfileRow>
                  <NameBlock>
                  <Greeting> {/* Morning/Afternoon is interchangable, function must be made */}
                      Good {new Date().getHours() < 12 ? "morning" : "evening"}
                  </Greeting>
                      {(isUpdating || isLoading) && (
                          <UpdatingRow>
                              <Spinner style={{ width: 14, height: 14, marginRight: 6 }} />
                              Updating
                          </UpdatingRow>
                      )}
                  </NameBlock>
              </ProfileRow>
            
              <CredButton onClick={goToId}>
                  <CredIconSquare>
                      <CarIcon src={carIcon} alt="" />
                  </CredIconSquare>

                  <ContentsButton>
                    <CredText>Driver Licence</CredText>
                    <Chevron>&#8250;</Chevron>
                  </ContentsButton>
              </CredButton>

              <ServicesContainer>
                <SectionLabel>Services</SectionLabel>
                <ServiceButton>
                  <ServiceBadge>QLD</ServiceBadge>
                  <ServiceIconImportsOnly>
                    <FaCreditCard size={18} color="#fff" />
                  </ServiceIconImportsOnly>
                  <ButtonText>Check registration status</ButtonText>
                  <Chevron><FaExternalLinkAlt size={14} /></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <MdOutlineAttachMoney size='30' color="#363737"/>
                    </ServiceIconImportsOnly>
                  <ButtonText>Renew registration</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15' /></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <FaGavel size='22' color="#363737" /> 
                  </ServiceIconImportsOnly>
                  <ButtonText>Pay a fine</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15' /></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <IoLocationSharp size='25' color="#363737"/>
                  </ServiceIconImportsOnly>
                  <ButtonText>Find a Customer Service {`\n`}Centre</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15'  /></Chevron>
                </ServiceButton>
              </ServicesContainer>

              <LearnMoreAbout>
                <SectionLabel>Learn more about</SectionLabel>
                <HorizontalScrollingContainer>
                  <InformationButton>
                    <ServiceImg src={imgLM1} alt="Security & Privacy" loading="lazy" decoding="async" />
                    <InfoCaption>
                      <ButtonText style={{fontSize:13}}>Security &amp; Privacy of your information</ButtonText>
                    </InfoCaption>
                    <ChevronBtmCorner><FaExternalLinkAlt size={12} /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM2} alt="Digital License App" loading="lazy" decoding="async" />
                    <ButtonText>The Digital {`\n`}License app</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM3} alt="Queensland Digital Identity" loading="lazy" decoding="async" />
                    <ButtonText>The {`\n`}Queensland{`\n`}Digital{`\n`}Identity</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM4} alt="Severe Weather" loading="lazy" decoding="async" />
                    <ButtonText>Plan for {`\n`} severe <br></br>weather</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM5} alt="Travelling with Digital License" loading="lazy" decoding="async" />
                    <ButtonText>Travelling <br></br>with my <br></br>digital license</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM6} alt="TMR Online Services" loading="lazy" decoding="async" />
                    <ButtonText>TMR online {`\n`}services</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>
                </HorizontalScrollingContainer>

                <ContentsButton style={{marginTop: 6, height: 40, width: 300, textAlign: 'center', justifyContent: 'center'}}>
                  <Chevron style={{fontSize: 16}}>&#8249;</Chevron>
                  <ButtonText style={{fontSize: 15, fontWeight: 600, color: COLOR_HEADING, opacity: 0.7}}>VIEW ALL</ButtonText>
                </ContentsButton>

              </LearnMoreAbout>


          </OverlapCard>
        </SafeArea>
    </>
  );
});

function goToId() {
  window.location.href = "/id"; // Navigate to the /id route
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
  }, [currentPage, navigate]);


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
        return (
          <Suspense fallback={<LoadingScreen><Spinner/></LoadingScreen>}>
            <DigitalLicense navigateTo={setCurrentPage} />
          </Suspense>
        );
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
      {currentPage !== "GovID" && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}