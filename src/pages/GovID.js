import React, { useEffect, useState } from "react";
  import { setThemeColor } from "../components/themeColor";
  import { CopyOutlined, LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
  import PullToRefresh from "../components/PullToRefresh";
  import { useAuth } from "../components/AuthContext";
  import { useNavigate, Navigate } from "react-router-dom";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faCarSide, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import { motion } from "framer-motion";
  import { IoIosArrowBack } from "react-icons/io";


  import backgroundImage from './assets/background.png';
  import qldLogo from './assets/qldgov.png';
  import signature_1 from './signatures/signature.png';
  import signature_2 from './signatures/signature1.png';
  import signature_3 from './signatures/signature2.png';
  import signature_4 from './signatures/signature3.png';
  import signature_5 from './signatures/signature4.png';
  import "../styles/GovID.css";
  import OverlappingProfileCard from "../components/OverlappingProfileCard";

  const months = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
    7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
  };

  const COLOR_MAROON = "#972541";
  const COLOR_BG = "#e7e6ed";
  const COLOR_CARD = "#fff";
  const COLOR_YELLOW = "#F1AF5B";
  const COLOR_HEADING = "#444";
  const COLOR_MUTED = "#666";
  const COLOR_TEXT = "#111";
  const COLOR_NAV_ACTIVE = "#972541";
  const COLOR_NAV_INACTIVE = "#888";
  const COLOR_BORDER = "#ccc";


  const DigitalLicense = () => {
    const { userData, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [lastRefreshed, setLastRefreshed] = useState(getCurrentTime());
    const [licenseNum, setLicenseNum] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [signature, setSignature] = useState(null);
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const [pullDistance, setPullDistance] = useState(0);

    const fullUser = {
      firstname: userData?.firstName,
      middlename: userData?.middleName,
      lastname: userData?.lastName,
      photoUrl: userData?.photo,
      day: userData?.day,
      month: userData?.month,
      age: userData?.age,
      houseNumber: userData?.houseNumber,
      street: userData?.street,
      type: userData?.type,
      suburb: userData?.suburb,
      postCode: userData?.postCode,
      country: userData?.country,
      state: userData?.state,
    };

    useEffect(() => {
      setThemeColor('#e0a02a');
      document.body.style.background = 'linear-gradient(135deg, #e0a02a 0%, #ffe595 100%)';
      determine_signature();
      generateLicenseNum();
      generateExpiryDate();
      cardnumbergenerator();
      return () => {
        document.body.style.background = '';
        setThemeColor('');
      };
    }, [userData]);

    // Redirect to login if not authenticated
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
    }, [isAuthenticated, navigate]);

    function getCurrentTime() {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = now.toLocaleString('en-US', { month: 'short' });
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12;
      return `${day} ${month} ${year} ${formattedHours}:${minutes}${ampm}`;
    }


    const calculateYearOfBirth = (age, birthMonth, birthDay) => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear(), birthMonth - 1, birthDay);
      if (now < birthDate) {
        return now.getFullYear() - age - 1;
      }
      return now.getFullYear() - age;
    };

    const generateExpiryDate = () => {
      const currentYear = new Date().getFullYear();
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const randomMonth = Math.floor(Math.random() * 12) + 1;
      const expiryYear = currentYear + 3;
      const formattedExpiryDate = `${randomDay} ${months[randomMonth]} ${expiryYear}`;
      setExpiryDate(formattedExpiryDate);

    };

    const cardnumbergenerator = () => {
      const cardNumber = Math.random().toString(36).slice(-10).toUpperCase();
      setCardNumber(cardNumber);
      localStorage.setItem('cardNumber', cardNumber);
    }

    const determine_signature = () => {
      const signatures = [signature_1, signature_2, signature_3, signature_4, signature_5];
      setSignature(signatures[Math.floor(Math.random() * signatures.length)]);
      localStorage.setItem('signature', signature);
    }

    const generateLicenseNum = async () => {
      const storedLicenseNum = localStorage.getItem('licenseNum');
      if (storedLicenseNum) {
        setLicenseNum(storedLicenseNum);
      } else {
        let license_num = '';
        for (let i = 0; i < 9; i++) {
          license_num += Math.floor(Math.random() * 10).toString();
        }
        localStorage.setItem('licenseNum', license_num);
        setLicenseNum(license_num);
      }
    };

    const handleRefresh = () => {
      setRefreshing(true);
      return new Promise(resolve => {
        setTimeout(() => {
          setLastRefreshed(getCurrentTime());
          setRefreshing(false);
          resolve();
        }, 1000);
      });
    };


    const redirectBack = () => {
      navigate("/dashboard", { replace: true });
    }

    const safeUpperCase = (text) => (text || "").toUpperCase();
    const toggleImageExpansion = () => setIsImageExpanded(!isImageExpanded);

    return (
      <>
        <div className="govid-banner-sticky"
          style={{
            zIndex: 10000,
          }}
        >
          <span className="govid-back-arrow" onClick={() => navigate("/dashboard", { replace: true })}> 
            <IoIosArrowBack /> <span className="backBtn">Back</span>
          </span>
          <div className="govid-banner-spacer" />
          <img src={qldLogo} alt="Queensland Government" className="govid-banner-qld-logo" style={{ pointerEvents: 'none' }} />
        </div>

          <motion.img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            style={{
            position: "fixed",
            top: 100,
            left: 100,
            width: "50vw",
            height: "50vh",
            objectFit: "contain", // Use 'contain' for resizeMode equivalent
            transformOrigin: 'center',
            opacity: 0.1,
            zIndex: 1,
            pointerEvents: "none",
            userSelect: "none",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
            }}
          />
          
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
        <div className="govid-container" style={{
          minHeight: '100vh',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
          background: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Sticky Banner/Header */}

          {/* Static Title */}
          <div className="govid-header-title-static">Driver Licence</div>

          <div className="govid-card">
            <div className="govid-card-row">
              {userData?.photo ? (
                <div className="govid-photo-wrapper" onClick={toggleImageExpansion}>
                  <img src={userData?.photo} alt=" "className="govid-photo"/>
                </div>  
              ) : (
                <div className="govid-photo-placeholder" />
              )}
              <div className="govid-info">
                {userData?.firstname ? (
                  <div className="govid-name-main">
                    <span className="govid-name-text">
                      {safeUpperCase(userData?.firstname)} {safeUpperCase(userData?.middlename)}
                    </span>
                    <span className="govid-name-last">
                      {safeUpperCase(userData?.lastname)}
                    </span>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
                <div className="govid-info-label">DoB</div>
                <div className="govid-bold govid-value-left" style={{ letterSpacing: "1px", fontWeight: '600'}}>
                  {fullUser?.day} {months[fullUser?.month]} {calculateYearOfBirth(fullUser?.age, fullUser?.month, fullUser?.day)}
                </div>
                <div className="govid-licence-row">
                  <span className="govid-info-label"><u>Licence No.</u> <CopyOutlined className="govid-copy-icon govid-value-left" /></span>
                  
                </div>
                <div className="govid-bold govid-value-left" style={{ letterSpacing: "1px", fontWeight: '600'}}>{licenseNum}</div>
              </div>
            </div>
            {isImageExpanded && fullUser.photoUrl && (
              <div className="govid-overlay" onClick={toggleImageExpansion} style={{ background: 'rgba(0,0,0,0.4)' }}>
                <img className="govid-expanded-image" src={fullUser.photoUrl} alt="Expanded" />
              </div>
            )}
            <div className="govid-refreshed">
              <span className="govid-refreshed-label">Information was refreshed online:</span>
              <span className="govid-refreshed-value">{lastRefreshed}</span>
            </div>
            <div className="govid-divider" />

            <div className="govid-row">
              <span className="govid-label"><u>Status</u> <InfoCircleOutlined style={{ fontSize: 14, verticalAlign: -1 }} /></span>
              <span className="govid-status-badge">Current</span>
            </div>
            <div className="govid-divider" />

            <div className="govid-row">
              <span className="govid-label">Age</span>
              <span className="govid-age-badge">
                <FontAwesomeIcon icon={faCircleCheck} size={120} className="govid-age-icon" alt="Tick" style={{ color: "#2e9170" }} />
                <span className="govid-age-text govid-value-left">Over 18</span>
              </span>
            </div>
            <div className="govid-divider" />

            <div className="govid-row impo">
                <span className="govid-label"><u>Class</u> <InfoCircleOutlined style={{ fontSize: 14, verticalAlign: -1 }} /></span>
                <span className="govid-value" style={{ flex: 1}}>
                  (C) Car <FontAwesomeIcon icon={faCarSide} className="govid-car-icon" />
                </span>
            </div>
            <div className="govid-row impo">
              <span className="govid-label">Type</span>
              <span className="govid-value">(L) Learner</span>
            </div>
            <div className="govid-row impo">
              <span className="govid-label">Expiry</span>
              <span className="govid-value">{expiryDate}</span>
            </div>
            <div className="govid-divider" />

            <div className="govid-row">
              <span className="govid-label"><u>Conditions</u> <InfoCircleOutlined style={{ fontSize: 14, verticalAlign: -1 }} /></span>
              <span className="govid-value">-</span>
            </div>
            <div className="govid-divider" />

            {/* ADDRESS */}
            <div className="govid-row govid-row-address">
              <div>
                <span className="govid-label">Address</span>
                <span className="govid-sublabel">Are your details<br /> up to date?</span>
              </div>
              <span className="govid-value-address" style={{ paddingLeft: "40px"}}>
                {safeUpperCase(fullUser.houseNumber)} {safeUpperCase(fullUser.street)} {safeUpperCase(fullUser.type)}
                <br />
                {safeUpperCase(fullUser.suburb)}
                <br />
                QLD {safeUpperCase(fullUser.postCode)}
                <br />
                AU
              </span>
            </div>
            <div className="govid-divider" />

            {/* CARD NUMBER */}
            <div className="govid-row">
              <span className="govid-label"><u>Card number</u> <CopyOutlined className="govid-copy-icon govid-value-left" /></span>
              <span className="govid-value">{cardNumber}</span>
            </div>
            
            <div className="govid-divider" />
              {/* SIGNATURE */}
              <div className="govid-row govid-row-signature">
                <span className="govid-label">Signature</span>
                <span>
                  {signature && (
                    <img className="govid-signature" src={signature} alt="Signature" style={{ pointerEvents: 'none'}} />
                  )}
                </span>
              </div>
            <div className="govid-divider" />

            {/* COUNTRY & AUTHORITY */}
            <div className="govid-row govid-row-country">
              <div>
                <span className="govid-label">Issuing Country</span>
                <br />
                <span className="govid-label">Issuing Authority</span>
              </div>
              <div style={{textAlign: "right"}}>
                <span className="govid-value">AU</span>
                <br />
                <span className="govid-value">Queensland Government<br/>Department of Transport<br/>and Main Roads</span>
              </div>
            </div>
          </div>
        </div>
          {/* Sticky share button at bottom */}
      </PullToRefresh>
      <div className="govid-share-btn-sticky-wrapper" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'env(safe-area-inset-bottom, 0px)',
        width: '100%',
        zIndex: 9999,
        margin: 0,
        padding: '10px 5px',
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, transparent, #e0a02a)',
        backdropFilter: 'blur(10px)',
      }}>
        <button className="govid-share-btn" onClick={() => navigate('/id/share')}>SHARE DRIVERS LICENSE</button>
      </div>        
      </>
    );
  };

  export default DigitalLicense;


