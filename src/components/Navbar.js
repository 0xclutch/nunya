import React from "react";
import styled from "styled-components";
import { GrHomeRounded } from "react-icons/gr";
import { HiOutlineQrCode } from "react-icons/hi2";
import { RiQrScan2Line } from "react-icons/ri";
import { IoWalletOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 85px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
  border-top: 2px solid #00000015;
    box-shadow: 0 -2px 8px #0002;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#972541" : "#888")};
  font-size: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  outline: none;
  gap: 2px;
`;

const NavLabel = styled.span`
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#972541" : "#888")};
  font-weight: 400;
  padding: 5px;
`;

const ActiveMarker = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background-color: #ffffff;
  margin-bottom: 6px;
  opacity: ${({ $active }) => ($active ? 0 : 0)};
  transition: opacity 0.2s ease;
`;

const ShowQRWrapper = styled.div`
  position: absolute;
  top: -15px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MiddleNavLabel = styled.span`
  font-size: 14px;
  padding-top: 2.4vh;
  color: ${({ $active }) => ($active ? "#972541" : "#888")};
  font-weight: 400;
  line-height: 1;
`;

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    return (
        <NavBar>
            <NavButton
                $active={path === "/dashboard" || path === "/"}
                onClick={() => navigate("/dashboard")}
            >
                <ActiveMarker $active={path === "/dashboard" || path === "/"} />
                <GrHomeRounded size='25' />
                <NavLabel $active={path === "/dashboard" || path === "/"}>Home</NavLabel>
            </NavButton>
            <NavButton 
                $active={path === "/wallet"}
                onClick={() => navigate("/wallet")}
            >
                <ActiveMarker $active={path === "/id/wallet"} />
                <IoWalletOutline size='27' />
                <NavLabel $active={path === "/id/wallet"}>Wallet</NavLabel>
            </NavButton>
            <NavButton 
                $active={path === "/id/scanqr" || path === "/id/share/qr"}
                onClick={() => navigate("/id/share/qr")}
            >
                <ShowQRWrapper>
                    <HiOutlineQrCode size='40' color='#888' />
                    <MiddleNavLabel $active={path === "/id/scanqr" || path === "/id/share/qr"}>Show QR</MiddleNavLabel>
                </ShowQRWrapper>
            </NavButton>
            <NavButton
                $active={path === "/scan" || path === "/scan-qr"}
                onClick={() => navigate("/scan")}
            >
                <ActiveMarker $active={path === "/scan" || path === "/scan-qr"} />
                <RiQrScan2Line size='27' />
                <NavLabel $active={path === "/scan" || path === "/scan-qr"} style={{ width: "100%"}}>Scan QR</NavLabel>
            </NavButton>
            <NavButton
                $active={path === "/messages" || path === "/settings/manage"}
                onClick={() => navigate("/messages")}
            >
                <ActiveMarker $active={path === "/messages" || path === "/settings/manage"} />
                <CiMail size='27' />
                <NavLabel $active={path === "/messages" || path === "/settings/manage"}>Messages</NavLabel>
            </NavButton>
        </NavBar>
    );
}