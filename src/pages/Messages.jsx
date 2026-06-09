import React from "react";
import "../styles/Messages.css";
import { useNavigate } from "react-router-dom";
import headerIcon from "./assets/White_NewQLDGovBanner.png";

import noMesssages from "./assets/messages-placeholder.jpg";
import PullToRefresh from "../components/PullToRefresh";

export default function Messages() {
    const navigate = useNavigate();

    return (
        <PullToRefresh onRefresh={() => {
            // Simulate refreshing data
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }}>

            <div className="top-header-messages">
                <div className='gov-banner-messages'>
                    <img src={headerIcon} alt="Queensland Government" className="gov-banner-img-messages" />
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                fontSize: "24px",
                color: "#555",
                backgroundColor: "#FFFFFF",
                }}
            >

                <h1 className="inbox-messages-header">Your inbox is empty</h1>
                <img src={noMesssages} alt="Messages Placeholder" style={{ width: "36vh", marginBottom: "20px" }} />
                <p className="messages-disclaimer-content">You dont have any messages.</p>
            </div>
        </PullToRefresh>
    );

}