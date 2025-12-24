import { useAuth } from "./AuthContext";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ScanQR.css";

import { supabase } from "./supabaseClient";

// Ui and shit
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const changelogVersion = "2.0.1"; //    Bump me when making changes, add the neccessary comment
const FORCE_SHOW_CHANGELOG = false; // Set to true to always show the changelog popup (for testing)
const updateTitle = `In version 2.0.1 There are a few small changes`
const updateNotes = {
    "Main Updates": [
        "Replaced colour pallete used for background on ID page",
        "Improved stability of the app with various bug fixes and optimizations.",
        "Improved image rendering for newer devices.",
        "iOS users can now enable Face ID scanning for quicker access to the app.",
        "Android biometric authentication is still working in progress.",
    ],
    // "Other Improvements": [
    //     "Improved the overall user interface for a more modern and sleek look.",
    //     "Enhanced security measures to protect user data and privacy.",
    //     "Optimized the app for better performance and faster load times.",
    // ]
};



export default function ChangelogPopup() {
    const [open, setOpen] = useState(false);
    const { userData, isAuthenticated } = useAuth();
    const hasChecked = useRef(false); // Prevent multiple checks

    useEffect(() => {
        // Prevent running multiple times
        if (hasChecked.current) {
            return;
        }

        // Force show if manual flag is true
        if (FORCE_SHOW_CHANGELOG) {
            setOpen(true);
            hasChecked.current = true;
            return;
        }
        
        // Add throttling - only check once every 12 hours
        const lastCheck = localStorage.getItem('changelog-last-check');
        const now = Date.now();
        const twelveHours = 12 * 60 * 60 * 1000;
        
        if (lastCheck && (now - parseInt(lastCheck)) < twelveHours) {
            hasChecked.current = true;
            return; // Skip if checked recently
        }
        
        if (!userData?.uuid || !isAuthenticated) {
            return; // Skip if user not loaded
        }

        hasChecked.current = true; // Mark as checked

        try {
            const checkChangelog = async () => {
                // Check localStorage first to avoid database call
                const cachedVersion = localStorage.getItem('changelog-version');
                if (cachedVersion === changelogVersion) {
                    return; // Already seen this version
                }

                const { data, error } = await supabase
                    .from('users')
                    .select('last_seen_changelog_version')
                    .eq('uuid', userData.uuid)
                    .single();
                    
                if (error) {
                    console.error("Error fetching user data:", error);
                    return;
                }
                
                if (data.last_seen_changelog_version !== changelogVersion) {
                    setOpen(true);
                    // Update the user's last seen changelog version
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({ last_seen_changelog_version: changelogVersion })
                        .eq('uuid', userData.uuid);
                        
                    if (updateError) {
                        console.error("Error updating changelog version:", updateError);
                    } else {
                        // Cache the version locally
                        localStorage.setItem('changelog-version', changelogVersion);
                    }
                }
                
                // Update last check timestamp
                localStorage.setItem('changelog-last-check', now.toString());
            };
            
            checkChangelog();

        } catch (error) {
            console.error("Error checking changelog:", error);
        }
    }, [userData?.uuid, isAuthenticated]); // Keep dependencies but use ref to prevent re-runs


    const acknowledgedChangelog = () => {
        setOpen(false);
    };

    if (!open) return null;
    return (
        // Use MUI modal
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="changelog-title"
            aria-describedby="changelog-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '85%', // Adjusted width to leave 5-10% space on the sides
                maxWidth: 600, // Limit the maximum width for larger screens
                bgcolor: 'background.paper',
                borderRadius: '12px', // Rounded corners for a modern look
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                p: 4,
                maxHeight: '80vh',
                overflowY: 'auto',
                margin: '0 auto', // Center the modal horizontally
            }}>
                <Typography id="changelog-title" variant="h5" component="h2" sx={{
                    fontWeight: 'bold',
                    color: '#333', // Darker text for better readability
                    textAlign: 'center', // Center the title
                    mb: 2, // Add spacing below the title
                }}>
                    Thank you for your support! 💙 VER{changelogVersion} ✨
                </Typography>
                <Typography id="changelog-description" sx={{
                    mt: 2,
                    whiteSpace: 'pre-line',
                    color: '#555', // Softer text color for the description
                    lineHeight: 1.6, // Improve readability with better line spacing
                }}>
                    <Typography sx={{ fontWeight: 'bold', marginBottom: '12px', display: 'block',textAlign: 'center' }}>
                        {updateTitle}
                    </Typography>
                    {Object.keys(updateNotes).map((note, index) => (
                        <div key={index}>
                            <strong style={{ color: '#972541' }}>• {note}</strong> {/* Highlighted section title */}
                            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                {updateNotes[note].map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Typography>
                <Typography sx={{ mt: 2, color: '#777', fontSize: '0.9em', textAlign: 'center' }}>
                    (You won't see this again unless there's a major update) <p></p>
                    Be sure to check out the new pages in Settings for some cool features! 🚀
                </Typography>
                <Button
                    onClick={() => acknowledgedChangelog()}
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 3,
                        display: 'block',
                        mx: 'auto', // Center the button
                        backgroundColor: '#972541', // Custom color for the button
                        '&:hover': {
                            backgroundColor: '#7b1e3a', // Darker shade on hover
                        },
                        textTransform: 'none', // Disable uppercase text
                        borderRadius: '8px', // Rounded button
                        padding: '8px 16px', // Adjust padding for a modern look
                    }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}



// How to put this into a website
// 1. Import the component
// 2. Add <ChangelogPopup /> to the root of your app, such as in App.js or similar
// 3. Ensure you have a 'users' table in your Supabase database with a 'last_seen_changelog_version' column
// 4. Update the changelogVersion variable and updateNotes object as needed for future updates
