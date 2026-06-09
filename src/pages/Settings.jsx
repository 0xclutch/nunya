import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { supabase } from '../components/supabaseClient';

// For PWA notifications, handle them with the Notification API if available
// For icons, use react-icons
import { 
  IoKeyOutline, 
  IoFingerPrintOutline, 
  IoShieldCheckmarkOutline, 
  IoChevronForwardOutline, 
  IoNotificationsCircle, 
  IoDocumentTextOutline, 
  IoGlobeOutline, 
  IoPersonCircleOutline 
} from 'react-icons/io5';

import '../styles/Settings.css'; // Styles are written in a CSS file for PWA/ReactJS
import qldGovLogo from './assets/_QueenslandGovt.png'; // Adjust path as needed

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  return (
    <div className="buttonText" onClick={handlePress}>
      {children || "Open Link"}
    </div>
  );
};

const Settings = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [allowNotifications, setAllowNotifications] = React.useState(false);
  const navigate = useNavigate();

  // For notifications (web)
  async function registerForPushNotificationsAsync() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      return;
    }
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') {
      alert('Failed to get permission for push notification!');
      return;
    }
    // In production, integrate with a service worker and push provider here
    alert('Notifications enabled!');
  }

  const LogoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert('Something went wrong while signing out..');
      return;
    } else {
      window.alert('Successfully signed out');
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="scrollViewContent">
        {/* <div className="button" onClick={() => navigate('/settings/manage')}> */}
        <div className="button">
          <IoKeyOutline size={20} color="#000" />
          <span className="buttonText">Sorry this option is currently unavaliable</span>
          <IoChevronForwardOutline size={20} color="#000" />
        </div>
        <div className="button">
          <IoFingerPrintOutline size={20} color="#000" />
          <span className="buttonText">Enable Face ID</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => setIsEnabled(prev => !prev)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="button">
          <IoShieldCheckmarkOutline size={20} color="#000" />
          <span className="buttonText">Securely reset Digital Licence</span>
          <IoChevronForwardOutline size={20} color="#000" />
        </div>
        <div className="button">
          <IoNotificationsCircle size={20} color="#000" />
          <span className="buttonText">Enable push notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={allowNotifications}
              onChange={() => {
                setAllowNotifications(prev => !prev);
                if (!allowNotifications) registerForPushNotificationsAsync();
              }}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="button">
          <IoDocumentTextOutline size={20} color="#000" />
          <span className="buttonText">Terms and Conditions</span>
          <IoChevronForwardOutline size={20} color="#000" />
        </div>
        <div className="button">
          <IoGlobeOutline size={20} color="#000" />
          <span className="buttonText">
            <OpenURLButton url="https://www.qld.gov.au/transport/online-services">
              Access TMR Online Services
            </OpenURLButton>
          </span>
          <IoChevronForwardOutline size={20} color="#000" />
        </div>
        <div className="button">
          <IoPersonCircleOutline size={20} color="#000" />
          <span className="buttonText">
            <OpenURLButton url="https://identity.qld.gov.au/login/login.html">
              Manage your Queensland Digital Identity
            </OpenURLButton>
          </span>
          <IoChevronForwardOutline size={20} color="#000" />
        </div>
        <div className="feedbackButton">
          <OpenURLButton url="https://www.transporttalk.tmr.qld.gov.au/jfe/form/SV_8BpqoBULWNnlKZw">
            <span className="feedbackText">GIVE US YOUR FEEDBACK</span>
          </OpenURLButton>
        </div>
        <div className="logout" onClick={LogoutUser}>
          <span className="logoutText">LOGOUT</span>
        </div>
        <img src={qldGovLogo} className="logo" alt="Queensland Government Logo" />
        <div className="details">
          Digital License App <br />
          Copyright© State of Queensland 2024<br />
          Version No: 2.19.0 (6636)
        </div>
      </div>
    </div>
  );
};

export default Settings;