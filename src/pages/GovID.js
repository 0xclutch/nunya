import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Spin } from "antd";
import { motion } from 'framer-motion';
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../components/AuthContext";
import PullToRefresh from "react-pull-to-refresh";

import DriverLicenseCard from "../components/DriverLicenseCard";
import CustomHeader from "../components/CustomHeader";
import backgroundImage from './assets/background.png';
import tickImage from './assets/tick.png';
import './assets/tick.png';

import "../styles/GovID.css";

const months = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
};

const DigitalLicense = () => {
  const { user, userData } = useAuth();
  const [lastRefreshed, setLastRefreshed] = useState(getCurrentTime());

  const [session, setSession] = useState(null);
  const [licenseNum, setLicenseNum] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [signature, setSignature] = useState(null);
  const signature_1 = require('./signatures/signature.png');
  const signature_2 = require('./signatures/signature1.png');
  const signature_3 = require('./signatures/signature2.png');
  const signature_4 = require('./signatures/signature3.png');
  const signature_5 = require('./signatures/signature4.png');

  const [profilePicture, setProfilePicture] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

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
    // 10 character alpha numeric random string
    const cardNumber = Math.random().toString(36).slice(-10).toUpperCase();
    setCardNumber(cardNumber);
  }

  const determine_signature = () => {
    const signatures = [signature_1, signature_2, signature_3, signature_4, signature_5];
    setSignature(signatures[Math.floor(Math.random() * signatures.length)]);      
  }

  const generateLicenseNum = async () => {
    const storedLicenseNum = await localStorage.getItem('licenseNum');
    console.log(storedLicenseNum)

    if (storedLicenseNum) {
      setLicenseNum(storedLicenseNum);
      console.log("License number already exists:", storedLicenseNum);
    } else {
      let license_num = '';
      for (let i = 0; i < 9; i++) {
        license_num += Math.floor(Math.random() * 10).toString();
      }

      await localStorage.setItem('licenseNum', license_num);
      setLicenseNum(license_num);
    }
  };


  const handleRefresh = () => {
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setLastRefreshed(getCurrentTime());
        setLoading(false);
        resolve();
      }, 1000);
    });
  };
  
  

  


  const safeUpperCase = (text) => (text || "").toUpperCase();

  const toggleImageExpansion = () => setIsImageExpanded(!isImageExpanded);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container">
        <motion.img
          src={backgroundImage}
          alt="Background"
          className="backgroundImage"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
        />
        <CustomHeader />
        <div className="scrollViewContent">
          <div className="digitalID">
            <div className="profileContainer">
              {profilePicture && (
                <button onClick={toggleImageExpansion} className="imageButton">
                  <img className="profilePicture" src={profilePicture} alt="Profile" />
                </button>
              )}
              <div className="textContainer">
                {user && (
                  <>
                    <div className="unimportantNames">
                      {safeUpperCase(user.firstname)} {safeUpperCase(user.middlename)}
                    </div>
                    <div className="importantLast">{safeUpperCase(user.lastname)}</div>

                    <div className="labelBasicGrey">DoB</div>
                    <div className="dateOfBirth">
                      {user.day} {months[user.month]} {calculateYearOfBirth(user.age, user.month, user.day)}
                    </div>
                    <div className="licenseNoLabel">Licence No.</div>
                    <div className="licenceNum">{licenseNum}</div>
                  </>
                )}
              </div>
            </div>

            {isImageExpanded && (
              <div className="overlay" onClick={toggleImageExpansion}>
                <img className="expandedImage" src={profilePicture} alt="Expanded" />
              </div>
            )}

            <div className="refreshed">
              <div className="refreshTextContainer">
                <div className="refreshLabel">Information was refreshed online:</div>
                <div className="refreshTime">{lastRefreshed}</div>
              </div>
              {refreshing && (
                <div className="loadingContainer">
                  <div className="loadingText">Loading...</div>
                  <div className="loadingIcon">
                    <div className="spinner" />
                  </div>
                </div>
              )}
            </div>

            <div className="divider" />

            <div className="statusContainer">
              <div className="statusTextContainer">
                <div className="statusOutline">Status ⓘ</div>
              </div>
              <button className="statusButton">
                <div className="statusButtonText">Current</div>
              </button>
            </div>

            <div className="divider" />

            <div className="ageContainer">
              <div className="ageLabel">Age</div>
              <div className="ageStatusContainer">
                <img src={tickImage} alt="Tick" className="ageIcon" />
                <div className="ageText">Over 18</div>
              </div>
            </div>

            <div className="divider" />

            <div className="vehicleInfo">
              <div className="vehicleClass">
                <div className="labelBasicGrey">Class</div>
                <div className="vehicleTextWithIcon">(C) Car</div>
              </div>
              <div className="vehicleType">
                <div className="labelBasicGrey">Type</div>
                <div className="vehicleTextCentered">(P1) Provisional</div>
              </div>
              <div className="idExpiry">
                <div className="labelBasicGrey">Expiry</div>
                <div className="vehicleTextCentered">{expiryDate}</div>
              </div>
            </div>

            <div className="divider" />

            <div className="conditions">
              <div className="labelBasicGrey">Conditions</div>
              <div className="ageStatusContainer">
                <div>-</div>
              </div>
            </div>

            <div className="divider" />

            <div className="addressContainer">
              <div className="addressTitleContainer">
                <div className="labelBasicGrey">Address</div>
                <div className="italicText">
                  Are your details up to <br /> date?
                </div>
              </div>
              <div className="addressInfo">
                {user && (
                  <>
                    <div>
                      {safeUpperCase(user.houseNumber)} {safeUpperCase(user.street)} {safeUpperCase(user.type)}
                    </div>
                    <div>{safeUpperCase(user.suburb)}</div>
                    <div>QLD {safeUpperCase(user.postCode)}</div>
                    <div>AU</div>
                  </>
                )}
              </div>
            </div>

            <div className="divider" />

            <div className="signatureContainer">
              <div className="statusOutline">Signature 🔍</div>
              <img className="signature" src={signature} alt="Signature" />
            </div>

            <div className="divider" />

            <div className="cardNumberContainer">
              <div className="label">Card number</div>
              <div className="cardNumber">
                <div className="value">{cardNumber}</div>
              </div>
            </div>

            <div className="divider" />

            <div className="countryInfo">
              <div className="country">
                <div className="label">Issuing Country</div>
                <div className="value">AU</div>
              </div>
              <div className="authority">
                <div className="label">Issuing Authority</div>
                <div className="space" />
                <div className="value">
                  Queensland Government <br />
                  Department of Transport <br />
                  and Main Roads
                </div>
              </div>
            </div>
          </div>

          <div className="bigSpace" />
        </div>
      </div>
    </PullToRefresh>
  );
};

export default DigitalLicense;
