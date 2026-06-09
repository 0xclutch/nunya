import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa";

// Place your logo in /assets/qld-crest-black.png

const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: 100px;
  background: linear-gradient(115deg, #efb157 65%, #f6ca7d 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  margin-left: 28px;
  font-size: 2.2rem;
  color: #111;
  font-family: 'SF Pro Display', 'Roboto', 'Arial', sans-serif;
`;

const BackText = styled.span`
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #000;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin-right: 0;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  margin-right: 34px;
  gap: 14px;
`;

const Crest = styled.img`
  height: 58px;
  width: auto;
`;

const QldGovBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 18px;
`;

const QldMain = styled.span`
  font-weight: 700;
  font-size: 2.2rem;
  color: #111;
  letter-spacing: 0;
  font-family: 'SF Pro Display', 'Roboto', 'Arial', sans-serif;
`;

const QldSub = styled.span`
  font-size: 2rem;
  font-weight: 400;
  color: #111;
  font-family: 'SF Pro Display', 'Roboto', 'Arial', sans-serif;
  margin-top: -5px;
`;

export default function PageHeader({ onBack }) {
  return (
    <StickyHeader>
      <Left>
        <FaChevronLeft />
        <BackText onClick={onBack} style={{cursor: "pointer"}} content="Back">Back</BackText>
      </Left>
      <Right>
        <Crest src="/assets/qld-crest-black.png" alt="Qld Crest" />
        <QldGovBlock>
          <QldMain>Queensland</QldMain>
          <QldSub>Government</QldSub>
        </QldGovBlock>
      </Right>
    </StickyHeader>
  );
}