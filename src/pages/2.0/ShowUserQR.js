import React from "react";
import QRGenerator from "../../components/QRGenerator";
import Navbar from "../../components/Navbar";

import styled, { createGlobalStyle } from "styled-components";

const ShowUserQR = () => {
    // Well... we made it. Welcome to 2.0 of the Nunya Project. Shocking.....

    return (
        <>
            <Navbar />
            <QRGenerator />
        </>
    );
}

export default ShowUserQR;