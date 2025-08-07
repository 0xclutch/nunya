import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';

import validQR from "../pages/assets/validQR.jpeg";
import "../styles/GovID.css";
import qldLogo from '../pages/assets/qldgov.png';

const Container = styled.div`
  background-color: #FFFFFF;
  min-height: 100vh;
  padding-top: 64px;
  font-family: 'SF Pro Display', sans-serif;
  text-align: center;
`;

const BackBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f3ca7e;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 500;
`;

const BackText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const Instruction = styled.div`
  margin: 24px 16px 16px;
  font-size: 16px;
  font-weight: 600;
`;

const UserPhoto = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  margin: 16px auto;
`;

const LicenseNumber = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
`;

const QRCodeImage = styled.img`
  width: 280px;
  height: 280px;
  margin: 16px auto;
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-top: 12px;
`;

const QRGenerator = () => {
  const { userData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);

  // Set screen brightness to max on mount, reset on timer end or unmount
  useEffect(() => {
    let brightnessSupported = false;
    let originalBrightness = null;
    // Try to set brightness to max if supported
    if (navigator.wakeLock && 'request' in navigator.wakeLock) {
      // Optionally keep screen awake (PWA best practice)
      navigator.wakeLock.request('screen');
    }
    if (navigator.brightness && typeof navigator.brightness.set === 'function') {
      brightnessSupported = true;
      navigator.brightness.get().then(val => {
        originalBrightness = val;
        navigator.brightness.set(1.0); // Set to max
      });
    } else if ('setScreenBrightness' in window) {
      // Some Android PWAs expose setScreenBrightness
      try { window.setScreenBrightness(1.0); } catch (e) {}
    }
    return () => {
      // Reset brightness if possible
      if (brightnessSupported && originalBrightness !== null) {
        navigator.brightness.set(originalBrightness);
      } else if ('setScreenBrightness' in window) {
        try { window.setScreenBrightness(0.5); } catch (e) {}
      }
    };
  }, []);

  // Reset brightness when timer hits 0
  useEffect(() => {
    if (timer === 0) {
      if (navigator.brightness && typeof navigator.brightness.set === 'function') {
        navigator.brightness.set(0.5); // Reset to default/medium
      } else if ('setScreenBrightness' in window) {
        try { window.setScreenBrightness(0.5); } catch (e) {}
      }
    }
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
        <div className="govid-banner-sticky">
            <span className="govid-back-arrow" onClick={() => navigate("/id/share", { replace: true })}> 
            <ArrowLeftOutlined /> <span>Back</span>
            </span>
            <div className="govid-banner-spacer" />
            <img src={qldLogo} alt="Queensland Government" className="govid-banner-qld-logo" style={{ pointerEvents: 'none' }} />
        </div>
      <Container>
        <Instruction>Show this QR Code to share your details</Instruction>

        {userData?.photo ? (
          <UserPhoto src={userData.photo} alt="User" />
        ) : (
          <UserPhoto src="https://via.placeholder.com/100" alt="Placeholder" />
        )}

        <LicenseNumber>{userData?.licenseNumber || "998 092 276"}</LicenseNumber>

        <QRCodeImage src={validQR} alt="Valid QR Code" />

        <Timer>{`00:${timer.toString().padStart(2, "0")}`}</Timer>
      </Container>
    </>
  );
};

export default QRGenerator;
