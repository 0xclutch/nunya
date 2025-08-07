import styled from "styled-components";
import { useEffect } from "react";

const SafeAreaView = styled.div`
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  height: calc(var(--vh, 1vh) * 100); /* <- THIS IS THE MAGIC */
  width: 100vw;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const SafeAreaWrapper = ({ children }) => {
  useEffect(() => {
    function setVh() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    setVh();
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return <SafeAreaView>{children}</SafeAreaView>;
};