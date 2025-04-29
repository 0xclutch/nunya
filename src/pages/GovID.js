import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Spin  } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../components/AuthContext"; 
import PullToRefresh from "react-pull-to-refresh";

const Container = styled.div`
  font-family: sans-serif;
  background: linear-gradient(to bottom, #f4a835, #fef6e5);
  min-height: 100vh;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const GovLogo = styled.img`
  height: 40px;
  margin-left: auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
  position: relative;
`;

const Status = styled.span`
  background: green;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
`;

const AgeTag = styled.span`
  background: green;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
`;

const ShareButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  background: #f4a835;
  border: none;
  font-weight: bold;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
`;

const RefreshInfo = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
`;

const Value = styled.span`
  position: absolute;
  right: 16px;
`;

const DigitalLicense = () => {
  const { user, userData } = useAuth(); // user for verifying authentication
  const [lastRefreshed, setLastRefreshed] = useState(getCurrentTime());
  const [progress, setProgress] = useState(0); // progress bar
  const [loading, setLoading] = useState(false); // loading state

  
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  function getCurrentTime() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    return `${day} ${month} ${year} ${formattedHours}:${minutes}${ampm}`;
  }

  const calculateYearOfBirth = (age, birthMonth, birthDay) => {
    const now = new Date();
    const birthDate = new Date(now.getFullYear(), birthMonth - 1, birthDay);
    
    // If the current date is before the birthday this year, subtract one more year from the age
    if (now < birthDate) {
      return now.getFullYear() - age - 1;
    }
    
    // Otherwise, return the year based on the current age
    return now.getFullYear() - age;
  };

  const handleRefresh = () => {
    setLoading(true);

    return new Promise(resolve => {
      setTimeout(() => {
        setLastRefreshed(getCurrentTime());
        setLoading(false);
        resolve();
      }, 1000); // Simulate network request time
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Container>
        <Header>
          <ArrowLeftOutlined /> Back
          <GovLogo src="https://via.placeholder.com/80x40" alt="Queensland Gov Logo" />
        </Header>
        <h3>Driver Licence</h3>


        <Card>
          <ProfileSection>
            <ProfileImage src="https://via.placeholder.com/80x100" alt="Profile" />
            <div>
              <div>{userData.firstname.toUpperCase()} {userData.middlename.toUpperCase()}</div>
              <div><strong> {userData.lastname.toUpperCase()}</strong></div>
              <div>DoB: <strong>{calculateYearOfBirth(userData.year, userData.month, userData.day)}</strong></div>
              <div>Licence No: <strong>142346510</strong></div>
            </div>
          </ProfileSection>
          <RefreshInfo>
            <p>Information was refreshed online:</p>
            <strong>{lastRefreshed}</strong>

            {loading && (
              <>
                <br></br>
                <Spin indicator={<LoadingOutlined spin />} size="small" style={{float: 'left',}} />
                <span>Updating...</span>
              </>
            )}
          </RefreshInfo>
          <InfoRow>
            <span>Status</span> <Status className="Value">Current</Status>
          </InfoRow>
          <InfoRow>
            <span>Age</span> <AgeTag className="Value">Over 18</AgeTag>
          </InfoRow>
          <InfoRow>
            <span>Class</span> <span className="Value">(C) Car 🚗</span>
          </InfoRow>
          <InfoRow>
            <span>Type</span> <span className="Value">(L) Learner</span>
          </InfoRow>
          <InfoRow>
            <span>Expiry</span> <span className="Value">20 Oct 2027</span>
          </InfoRow>
        </Card>
        <ShareButton type="primary">SHARE DRIVER LICENCE</ShareButton>
      </Container>
    </PullToRefresh>
  );
};

export default DigitalLicense;
