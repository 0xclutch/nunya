import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ScanQR.css";

const ScanQR = () => {
    const navigate = useNavigate();
    const videoEl = useRef(null);

    const [cameraOn, setCameraOn] = useState(false);
    const [error, setError] = useState("");
    const [retryTimeout, setRetryTimeout] = useState(null);

    const startCamera = async () => {
        try {
            console.info("[INFO] Attempting to start the camera...");
            const constraints = {
                video: { facingMode: { ideal: "environment" } },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoEl.current) {
                videoEl.current.srcObject = stream;
                setCameraOn(true);
                console.info("[INFO] Camera started successfully.");
            }
        } catch (err) {
            console.error("[ERROR] Failed to start the camera:", err);
            setError("Failed to start the camera. Retrying in 10 seconds...");
            setCameraOn(false);

            // Retry after 10 seconds
            if (!retryTimeout) {
                const timeout = setTimeout(() => {
                    startCamera();
                    setRetryTimeout(null);
                }, 10000);
                setRetryTimeout(timeout);
            }
        }
    };

    const stopCamera = () => {
        if (videoEl.current && videoEl.current.srcObject) {
            const tracks = videoEl.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoEl.current.srcObject = null;
        }
        setCameraOn(false);
        console.info("[INFO] Camera stopped.");
    };

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, []);

    return (
        <div className="qr-reader">
            <video
                ref={videoEl}
                playsInline
                autoPlay
                muted
                className="qr-video"
            />
            <div className="qr-box"></div>
            {error && (
                <div className="qr-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <Navbar currentPage="Scan QR" />
        </div>
    );
};

export default ScanQR;

