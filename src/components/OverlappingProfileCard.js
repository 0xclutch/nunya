import styled from "styled-components";

// Card container, relatively positioned for absolute children
const Card = styled.div`
  position: relative;
  width: 50vw;
  display: flex;
  flex-direction: column;
  margin: 0;
`;

// Profile picture wrapper for absolute positioning
const ProfilePicWrapper = styled.div`
  position: absolute;
  margin-right: 20px;
  top: -55px; /* Adjust for desired overlap */
  left: 10px;  /* Align with card's left padding */
  z-index: 3;
`;

// The profile image itself
const ProfilePicture = styled.img`
  width: 130px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
  box-shadow: 0 1.5px 8px rgba(20,10,35,0.07);
  margin: 0;
`;

export default function OverlappingProfileCard({ src, children }) {
  return (
    <Card>
      <ProfilePicWrapper>
        <ProfilePicture src={src} alt="Profile" />
      </ProfilePicWrapper>
      <div style={{ marginLeft: 120, minHeight: 130 }}>{children}</div>
    </Card>
  )
}