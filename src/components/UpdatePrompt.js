import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin: 0 0 12px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  &:active {
    transform: scale(0.96);
  }
`;

const PrimaryButton = styled(Button)`
  background: #972541;
  color: #fff;

  &:hover {
    background: #7b1f35;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e7e6ed;
  color: #111;

  &:hover {
    background: #d9d8e8;
  }
`;

export default function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Listen for messages from the service worker
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        console.log('[UpdatePrompt] Update available:', event.data.message);
        setShowUpdate(true);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleRefresh = () => {
    // Reload the page to get the latest version
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>Update Available</ModalTitle>
        <ModalMessage>
          A new version of the app is ready. Refresh now to get the latest features and improvements.
        </ModalMessage>
        <ButtonGroup>
          <SecondaryButton onClick={handleDismiss}>Later</SecondaryButton>
          <PrimaryButton onClick={handleRefresh}>Refresh Now</PrimaryButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
