import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageApp.css'; // Import styles for ManageApp
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import { supabase } from '../components/supabaseClient';

const ManageApp = () => {
    const navigate = useNavigate();   
    const handleLogout = async () => { 
        const { error } = await supabase.auth.signOut();
        if (error) {
            window.alert('Something went wrong while signing out..');
            return;
        }
        navigate('/', { replace: true });
    };

    const changePin = () => { 
        alert('coming soon')
     };
    const deleteAccount = async () => { 
        alert('coming soon')
     };
    const registerForPushNotificationsAsync = async () => { 
        alert('coming soon - allows for notifications when updates roll out, monthly-ish notifs')
     };

    return (
        <div className="manageapp-container">
            <header className="manageapp-header">
                <h1 className="manageapp-title">Manage App</h1>
                <button className="manageapp-btn" onClick={handleLogout}>
                    <IoLogOutOutline size={24} />
                    Logout
                </button>
            </header>
            <div className="manageapp-content">
                <button className="manageapp-btn" onClick={changePin}>
                    <IoSettingsOutline size={24} />
                    Change my PIN
                </button>
                <button className="manageapp-btn" onClick={registerForPushNotificationsAsync}>
                    Enable Notifications
                </button>
                <button className="manageapp-btn" onClick={deleteAccount}>
                    Delete My Account
                </button>
            </div>
            <div className="manageapp-footer">
                <p>Version 2.0.1</p>
                <b>@mkflame700 on Telegram for help</b>
            </div>
        </div>
    );
}
export default ManageApp;