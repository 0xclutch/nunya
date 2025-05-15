import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DriverLicenseCard.css';

const DriverLicenseCard = () => {
  const navigate = useNavigate();

  const redirectToShare = () => {
    navigate('/share');
  };

  return (
    <div className="dl-container">
      <div className="dl-cardContainer">
        {/* Other elements of the card such as photo, text fields, etc. */}
      </div>

      {/* Sticky Share Button */}
      <button className="dl-button" onClick={redirectToShare}>
        SHARE DRIVER'S LICENSE
      </button>
    </div>
  );
};

export default DriverLicenseCard;
