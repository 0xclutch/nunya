import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/ScanQR.css";
import QrScanner from "qr-scanner";

const ScanQR = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);

    const [qrOn, setQrOn] = useState(false);
    const [scannedResult, setScannedResult] = useState("");
    const [error, setError] = useState("");
    const [permissionChecked, setPermissionChecked] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Attempt to request camera permission explicitly
    useEffect(() => {
        const requestCameraAccess = async () => {
            try {
                // Explicitly request environment (rear) camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                    audio: false,
                });

                // Assign stream to video element
                if (videoEl.current) {
                    videoEl.current.srcObject = stream;
                }

                // Set up QR scanner
                scanner.current = new QrScanner(
                    videoEl.current,
                    (result) => {
                        console.log("QR Scan success:", result?.data);
                        setScannedResult(result?.data);
                    },
                    {
                        onDecodeError: (err) => {
                            if (err?.name !== "NotFoundError") {
                                console.warn("QR decode error:", err);
                            }
                        },
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        preferredCamera: "environment",
                        maxScansPerSecond: 5,
                        overlay: qrBoxEl.current || undefined,
                    }
                );

                await scanner.current.start();
                setQrOn(true);
            } catch (err) {
                console.error("Camera access denied or failed:", err);
                setError("Camera permission denied. Please allow access to scan QR codes.");
                setQrOn(false);
            } finally {
                setPermissionChecked(true);
            }
        };

        requestCameraAccess();

        return () => {
            scanner.current?.stop();
            scanner.current = null;
        };
    }, []);

    return (
        <div className="qr-reader">
            <video
                ref={videoEl}
                playsInline
                autoPlay
                muted
                style={{ width: "100%", height: "auto", borderRadius: "12px" }}
            />

            <div ref={qrBoxEl} className="qr-box">
                {!qrOn && (
                    <img
                        src="/static/images/icons/scan_qr1.svg"
                        alt="QR Frame"
                        width={256}
                        height={256}
                        className="qr-frame"
                    />
                )}
            </div>

            {scannedResult && (
                <div className="scanned-result">
                    <strong>Scanned:</strong> {scannedResult}
                </div>
            )}

            {permissionChecked && !qrOn && error && (
                <div className="qr-error">
                    <strong>Error:</strong> {error}
                    <p>
                        Please go to your browser or phone settings and enable camera
                        access for this app.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScanQR;
