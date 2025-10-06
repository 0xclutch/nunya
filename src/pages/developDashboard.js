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
import { FaGavel  } from "react-icons/fa6";
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
  border-radius: 12px;
  width: 100%;
  height: 64px;
  margin: 8px 0 12px 0;
  padding: 8px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(20,10,35,0.06);
`;

/* small left badge for ID (keep simple) */
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

/* Services container and items reverted to previous form */
const ServicesContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
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

/* restore small chevron corner to the previous simple form */
const ChevronBtmCorner = styled.span`
  font-size: 10px;
  color: #111;
  margin-left: auto;
  margin-top: auto;
  margin-right: 6px;
  display: flex;
  padding: 5px;
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
// const ServiceImg = styled.img`
//   width: 100%;
//   height: 110px; /* image area height, adjust as needed */
//   object-fit: cover; /* fill and crop as needed */
//   object-position: top center; /* align crop to top */
//   display: block;
//   flex-shrink: 0;
// `;
  


// const ChevronBtmCorner = styled.span`
//   font-size: 10px;
//   color: #111;
//   margin-left: auto; /* Push the icon to the far right */
//   margin-top: auto;
//   margin-right: 6px;
//   display: flex;
//   padding: 5px;
// `;


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
                  <ServiceIconImportsOnly>
                    <VscCreditCard size='30' color="#363737" />
                  </ServiceIconImportsOnly>
                  <ButtonText>Check registration status</ButtonText>
                  <Chevron><FaExternalLinkAlt size={14} color="#363737" style={{ opacity: '0.5'}} /></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <MdOutlineAttachMoney size='30' color="#363737"/>
                    </ServiceIconImportsOnly>
                  <ButtonText>Renew registration</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15' color="#363737" style={{ opacity: '0.5'}}/></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <FaGavel size='22' color="#363737" /> 
                  </ServiceIconImportsOnly>
                  <ButtonText>Pay a fine</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15' color="#363737" style={{ opacity: '0.5'}}/></Chevron>
                </ServiceButton>

                <ServiceButton>
                  <ServiceIconImportsOnly>
                    <IoLocationSharp size='25' color="#363737"/>
                  </ServiceIconImportsOnly>
                  <ButtonText>Find a Customer Service {`\n`}Centre</ButtonText>
                  <Chevron><FaExternalLinkAlt size='15' color="#363737" style={{ opacity: '0.5'}} /></Chevron>
                </ServiceButton>
              </ServicesContainer>

              <LearnMoreAbout>
                <SectionLabel>Learn more about</SectionLabel>
                <HorizontalScrollingContainer>
                  <InformationButton>
                    <ServiceImg src={imgLM1} alt="Security & Privacy" loading="lazy" decoding="async" />
                    <ButtonText>Security <br></br> Privacy of your information</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size={12} color="#363737" /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM2} alt="Digital License App" loading="lazy" decoding="async" />
                    <ButtonText>The Digital <br></br>License app</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM3} alt="Queensland Digital Identity" loading="lazy" decoding="async" />
                    <ButtonText>The <br></br>Queensland<br></br>Digital<br></br>Identity</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM4} alt="Severe Weather" loading="lazy" decoding="async" />
                    <ButtonText>Plan for <br></br> severe <br></br>weather</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM5} alt="Travelling with Digital License" loading="lazy" decoding="async" />
                    <ButtonText>Travelling <br></br>with my <br></br>digital license</ButtonText>
                    <ChevronBtmCorner><FaExternalLinkAlt size='10' /></ChevronBtmCorner>
                  </InformationButton>

                  <InformationButton>
                    <ServiceImg src={imgLM6} alt="TMR Online Services" loading="lazy" decoding="async" />
                    <ButtonText>TMR online <br></br>services</ButtonText>
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
  font-size: 15px;
  color: ${COLOR_TEXT};
  margin-left: 8px;
  flex: 1;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  margin-left: 17px;
  letter-spacing: 0.01em;
  line-height: 1.2;
  white-space: normal;
  overflow-wrap: break-word;
`;

const Chevron = styled.span`
  position: absolute;  
  font-size: 32px;
  color: ${COLOR_TEXT};
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  right: 30px;
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