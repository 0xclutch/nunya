import React from "react";
import styled from "styled-components";
import { setThemeColor } from "../components/themeColor";
import { useAuth } from "../components/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { resetThemeColor } from "../components/themeColor";
import { useEffect } from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { FaFilePdf, FaUser, FaCheckCircle, FaIdCard } from "react-icons/fa";
import qldLogo from './assets/qldgov.png';

import "../styles/GovID.css";

const ShareIDWrapper = styled.div`
  background-color: #fff;
  min-height: 100vh;
  padding: 80px 16px 32px;
  box-sizing: border-box;
  font-family: 'SF Pro Display', sans-serif;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  color: #000;
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`;

const Icon = styled.div`
  font-size: 22px;
  color: #c89200;
  margin-top: 4px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #555;
  white-space: pre-line;
`;

const ShareID = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setThemeColor("#F3CA7E");
    return () => resetThemeColor();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="govid-banner-sticky">
        <span className="govid-back-arrow" onClick={() => navigate("/id", { replace: true })}>
          <ArrowLeftOutlined /> <span>Back</span>
        </span>
        <div className="govid-banner-spacer" />
        <img src={qldLogo} alt="Queensland Government" className="govid-banner-qld-logo" style={{ pointerEvents: 'none' }} />
      </div>

      <ShareIDWrapper>
        <SectionTitle>What would you like to share?</SectionTitle>

        <Card onClick={() => navigate("/id/share/qr", { replace: true })}>
          <Icon><FaIdCard /></Icon>
          <CardContent>
            <Title>Share my Driver Licence</Title>
            <Description>
              Photo, Name, DoB, Licence No., Class/es, Type/s, Conditions, Status, Expiry date, Address, Signature, Card number
            </Description>
          </CardContent>
        </Card>

        <Card onClick={() => navigate("/id/share/qr", { replace: true })}>
          <Icon><FaCheckCircle /></Icon>
          <CardContent>
            <Title>Prove I'm over 18</Title>
            <Description>
              Photo, Proof you are over 18
            </Description>
          </CardContent>
        </Card>

        <Card onClick={() => navigate("/id/share/qr", { replace: true })}>
          <Icon><FaUser /></Icon>
          <CardContent>
            <Title>Share my identity</Title>
            <Description>
              Photo, Name, DoB, Licence No., Signature
            </Description>
          </CardContent>
        </Card>

        <Card onClick={() => navigate("/id/share/qr", { replace: true })}>
          <Icon><FaFilePdf /></Icon>
          <CardContent>
            <Title>Share a printable copy</Title>
            <Description>
              Photo, Name, DoB, Licence No., Class/es, Type/s, Conditions, Status, Expiry date, Address, Signature, Card number
            </Description>
          </CardContent>
        </Card>
      </ShareIDWrapper>
    </>
  );
};

export default ShareID;
