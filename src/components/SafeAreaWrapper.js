import styled from "styled-components";

const SafeAreaView = styled.div`
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  min-height: 100vh;
  min-height: -webkit-fill-available; /* iOS height fix */
  width: 100%;
  position: relative;
  background-color: #ffffff;
`;

export const SafeAreaWrapper = ({ children }) => {
  return <SafeAreaView>{children}</SafeAreaView>;
};