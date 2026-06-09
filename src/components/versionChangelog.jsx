import { useState, useEffect, useRef } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const changelogVersion = "0.0.1"; // Bump me when making changes
const FORCE_SHOW_CHANGELOG = false; // Set to true to always show (for testing)
const updateTitle = `On the horizon... 🌅`;
const updateNotes = {
    "Main Updates": [
        "Welp, that wasn't expected... But do we give up?",
        "Increased security protocols to protect user data and privacy. Now privacy is number one priority because we care about you and your data! 🛡️",
        "New JWT Token signing mechanism for intelligent session verification",
        "Redesigned and refactored the old database for reliability, performance and scalability. This is a huge step towards creating the best digital experience",
    ],
    "Stay keen for!": [
        "Reportable bugs and feedback section",
        "Custom Signatures assignable in the app COMING SOON! (We know you want it)",
        "Working SCANNABLE QRs for SHARING with clerks- No more declined entry, you have a verified ID",
        "Stay tuned and keep the people coming, you are the real MVP and your support means the world",
    ]
};

export default function ChangelogPopup() {
    const [open, setOpen] = useState(false);
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        if (FORCE_SHOW_CHANGELOG) {
            setOpen(true);
            return;
        }

        const seenVersion = localStorage.getItem('changelog-version');
        if (seenVersion !== changelogVersion) {
            setOpen(true);
        }
    }, []);

    const acknowledgedChangelog = () => {
        localStorage.setItem('changelog-version', changelogVersion);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <Modal
            open={open}
            onClose={acknowledgedChangelog}
            aria-labelledby="changelog-title"
            aria-describedby="changelog-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '85%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                p: 4,
                maxHeight: '80vh',
                overflowY: 'auto',
            }}>
                <Typography id="changelog-title" variant="h5" component="h2" sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    mb: 2,
                }}>
                    Thank you for your support! 💙 VER{changelogVersion} ✨
                </Typography>

                <Typography id="changelog-description" sx={{
                    mt: 2,
                    whiteSpace: 'pre-line',
                    color: '#555',
                    lineHeight: 1.6,
                }}>
                    <Typography sx={{ fontWeight: 'bold', marginBottom: '12px', display: 'block', textAlign: 'center' }}>
                        {updateTitle}
                    </Typography>
                    {Object.keys(updateNotes).map((section, index) => (
                        <div key={index}>
                            <strong style={{ color: '#972541' }}>• {section}</strong>
                            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                {updateNotes[section].map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Typography>

                <Typography sx={{ mt: 2, color: '#777', fontSize: '0.9em', textAlign: 'center' }}>
                    (You won't see this again unless there's a major update)
                    <br />
                    Be sure to check out the new pages in Settings for some cool features! 🚀
                </Typography>

                <Button
                    onClick={acknowledgedChangelog}
                    variant="contained"
                    sx={{
                        mt: 3,
                        display: 'block',
                        mx: 'auto',
                        backgroundColor: '#972541',
                        '&:hover': { backgroundColor: '#7b1e3a' },
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                    }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}
