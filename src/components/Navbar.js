import React from "react";
import styled from "styled-components";
import { FaHome, FaQrcode, FaCog } from "react-icons/fa";

const COLOR_NAV_ACTIVE = "#972541";
const COLOR_NAV_INACTIVE = "#888";
const COLOR_BORDER = "#ccc";

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
  color: ${({ active }) => (active ? COLOR_NAV_ACTIVE : COLOR_NAV_INACTIVE)};
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
  color: ${({ active }) => (active ? COLOR_NAV_ACTIVE : COLOR_NAV_INACTIVE)};
  font-weight: 400;
  margin-top: 1.5px;
  letter-spacing: 0.04em;
`;

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <NavBar>
      <NavButton
        active={currentPage === "Home"}
        onClick={() => setCurrentPage("Home")}
        aria-label="Home"
      >
        <FaHome />
        <NavLabel active={currentPage === "Home"}>Home</NavLabel>
      </NavButton>
      <NavButton
        active={currentPage === "Scan QR"}
        onClick={() => setCurrentPage("Scan QR")}
        aria-label="Scan QR"
      >
        <FaQrcode />
        <NavLabel active={currentPage === "Scan QR"}>Scan QR</NavLabel>
      </NavButton>
      <NavButton
        active={currentPage === "Settings"}
        onClick={() => setCurrentPage("Settings")}
        aria-label="Settings"
      >
        <FaCog />
        <NavLabel active={currentPage === "Settings"}>Settings</NavLabel>
      </NavButton>
    </NavBar>
  );
}
