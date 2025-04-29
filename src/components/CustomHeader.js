import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material';
import '../styles/CustomHeader.css';
import qldGovLogo from '../pages/assets/qldgov.png';

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="header-container">
      <div className="gradient-container">
        {/* Use GradientText instead of LinearGradient */}
      </div>
      <div className="content-container">
        <div className="left-container">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowBack fontSize="small" />
            <span className="back-text">Back</span>
          </button>
          {/* Keep banner-text if it's needed separately */}
          <span className="banner-text">Driver Licence</span>
        </div>
        <img src={qldGovLogo} alt="QLD Government" className="qld-gov-logo" />
      </div>
    </div>
  );
};

export default CustomHeader;
