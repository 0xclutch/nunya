import React from "react";
import styled from "styled-components";
import { FaCarSide, FaPlus } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import Navbar from "../components/Navbar";

export default function WalletPage() {
  return (
    <PageWrapper>
      <TopHeader>
        <HeaderTitle>Wallet</HeaderTitle>
      </TopHeader>

      <ContentPanel>
        <CardRow>
          <CardIconSection>
            <FaCarSide size={38} color="#111" />
          </CardIconSection>

          <CardContent>
            <CardTitle>Driver Licence</CardTitle>
            <ChevronWrap>
              <IoChevronForward size={30} color="#111" />
            </ChevronWrap>
          </CardContent>
        </CardRow>

        <AddButton>
          <AddText>ADD</AddText>
          <Divider />
          <FaPlus size={28} color="#fff" />
        </AddButton>
      </ContentPanel>

      <Navbar />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #d9d9de;
  position: relative;
  overflow-x: hidden;
`;

const TopHeader = styled.div`
  height: 170px;
  width: 100%;
  background: linear-gradient(100deg, #7b0f28 0%, #8f1530 45%, #aa1f43 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -60px;
    left: -120px;
    width: 140%;
    height: 180px;
    background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0.05) 10%,
      rgba(255, 255, 255, 0.12) 45%,
      rgba(255, 255, 255, 0.04) 80%
    );
    transform: rotate(-10deg);
    border-radius: 40%;
    pointer-events: none;
  }
`;

const HeaderTitle = styled.h1`
  color: #fff;
  font-size: 34px;
  font-weight: 400;
  margin: 0;
  z-index: 1;
`;

const ContentPanel = styled.div`
  position: relative;
  background: #d9d9de;
  min-height: calc(100vh - 170px);
  margin-top: -12px;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 34px 22px 140px;
`;

const CardRow = styled.button`
  width: 100%;
  max-width: 680px;
  height: 52px;
  background: #f7f7f7;
  border: none;
  border-radius: 18px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
`;

const CardIconSection = styled.div`
  width: 115px;
  min-width: 115px;
  background: #e5aa57;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 18px 0 20px;
`;

const CardTitle = styled.div`
  flex: 1;
  text-align: left;
  font-size: 20px;
  font-weight: 400;
  color: #111;
`;

const ChevronWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddButton = styled.button`
  position: absolute;
  right: 22px;
  bottom: 110px;
  height: 82px;
  min-width: 194px;
  padding: 0 26px;
  border: none;
  border-radius: 28px;
  background: #871431;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  box-shadow: 0 16px 28px rgba(70, 20, 35, 0.2);
  cursor: pointer;
`;

const AddText = styled.span`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Divider = styled.div`
  width: 1.5px;
  height: 34px;
  background: rgba(255, 255, 255, 0.65);
`;