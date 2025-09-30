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


const changelogVersion = "2.0.0"; //    Bump me when making changes, add the neccessary comment
const updateTitle = `In version 2.0.0 there are a few changes made, \nSuch as the update of the Homepage and added additional scenes for ScanQR/ShareQR.\n`
const updateNotes = {
    "Main Updates": [
        "I want to start with an apology for the temporary downtime, we had experienced some technical difficulties with the hosting management and had to migrate to a better suited platform.",
        "New Features: 🔥💯💯",
        "Added a new homepage/dashboard for users to see their information at a glance.",
        "Updated the Scan QR page to include better error handling and user feedback.",
        "Introduced a new Share QR page for users to share their digital ID.",
        "Entirely changed icon library to mimic a more authentic look",
        "New page in settings allowing for account configuration!",
        "Added new developer anayltics to monitor app performance and add future improvements.",
        "All analytic reports are anonymous and stay that way - if you wish to opt out please message me",
        "Improved overall app performance and fixed minor bugs such as scrolling."
    ],
    "Other Improvements": [
        "Improved the overall user interface for a more modern and sleek look.",
        "Enhanced security measures to protect user data and privacy.",
        "Optimized the app for better performance and faster load times.",
    ]
};



export default function ChangelogPopup() {
    const [open, setOpen] = useState(false);
    const { userData, isAuthenticated } = useAuth();

    useEffect(() => {
        try {
            const checkChangelog = async () => {
                const user = supabase.auth.getUser();
                if (user) {
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
                        }
                    }
                }
            };
            checkChangelog();

        } catch (error) {
            console.error("Error checking changelog:", error);
            // The user will see this screen next time they open the app...
        
        }
    });


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
                    Thank you for your support! 💙 VER2.0.0 ✨
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
