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

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const requestCameraAccess = async () => {
            try {
                // iOS: facingMode: "environment" is supported, but fallback if needed
                let constraints = {
                    video: { facingMode: { ideal: "environment" } },
                    audio: false,
                };
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (videoEl.current) {
                        videoEl.current.srcObject = stream;
                    }
                } catch (e) {
                    // Fallback: try without facingMode
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    if (videoEl.current) {
                        videoEl.current.srcObject = stream;
                    }
                }

                scanner.current = new QrScanner(
                    videoEl.current,
                    (result) => {
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
                setError("Camera permission denied. Please allow access to scan QR codes. On iOS, go to Settings > Safari > Camera and allow access.");
                setQrOn(false);
            } finally {
                setPermissionChecked(true);
            }
        };

        requestCameraAccess();

        return () => {
            scanner.current?.stop();
            scanner.current = null;
            if (videoEl.current && videoEl.current.srcObject) {
                let tracks = videoEl.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoEl.current.srcObject = null;
            }
        };
    }, []);

    return (
        <div className="qr-reader" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#222',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <video
                ref={videoEl}
                playsInline
                autoPlay
                muted
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    borderRadius: 0,
                    background: '#222',
                }}
            />
            <div ref={qrBoxEl} className="qr-box" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1001,
                pointerEvents: 'none',
                width: 260,
                height: 260,
                border: '4px solid #000',
                borderRadius: '18px',
                boxSizing: 'border-box',
                background: 'none',
            }}>
                {/* No animated border, no scan frame image */}
            </div>
            {scannedResult && (
                <div className="scanned-result" style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    zIndex: 1002,
                    fontSize: '1.2rem',
                }}>
                    <strong>Scanned:</strong> {scannedResult}
                </div>
            )}
            {permissionChecked && !qrOn && error && (
                <div className="qr-error" style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,0,0,0.8)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    zIndex: 1002,
                    fontSize: '1.1rem',
                }}>
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