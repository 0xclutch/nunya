import React from "react";
import styled from "styled-components";
import { AiFillHome } from "react-icons/ai";
import { HiOutlineQrCode } from "react-icons/hi2";
import { RiQrScan2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 92px;
  background: #fff;
  border-top: 1.5px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
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
`;

const NavLabel = styled.span`
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#972541" : "#888")};
  font-weight: 400;
  padding: 5px;
`;

export default function Navbar({ currentPage, setCurrentPage }) {
    return (
        <NavBar>
            <NavButton
                $active={currentPage === "Home"}
                onClick={() => setCurrentPage("Home")}
            >
                <AiFillHome size='27' />
                <NavLabel $active={currentPage === "Home"}>Home</NavLabel>
            </NavButton>
            <NavButton 
                $active={currentPage === "ShowQR"}
                onClick={() => setCurrentPage("ShowQR")}
            >
                <HiOutlineQrCode size='27' />
                <NavLabel $active={currentPage === "ShowQR"}>Show QR</NavLabel>
            </NavButton>
            <NavButton
                $active={currentPage === "Scan QR"}
                onClick={() => setCurrentPage("Scan QR")}
            >
                <RiQrScan2Line size='27' />
                <NavLabel $active={currentPage === "Scan QR"}>Scan QR</NavLabel>
            </NavButton>
            <NavButton
                $active={currentPage === "Settings"}
                onClick={() => setCurrentPage("Settings")}
            >
                <IoSettingsOutline size='27' style={{ padding: '1px'}}/>
                <NavLabel $active={currentPage === "Settings"}>Settings</NavLabel>
            </NavButton>
        </NavBar>
    );
}
