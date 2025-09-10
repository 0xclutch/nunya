// I've fallen! And i can't get up!
// Basically how its like talking to these cunts

import { useState } from "react";
import { Button, Modal } from "antd";


const HelpButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  
   const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="default" onClick={showModal} style={{ position: "fixed", bottom: 20, right: 20 }}>
        Help me!
      </Button>
      <Modal
        title="Need Help?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Got it"
        cancelText="Close"
      >
        <p>Do you need direct assistance? <br /> <b>Telegram ONLY: @mkflame701</b></p>
        <p>Thank you for your support in the apps development! Please report any bugs to the above @</p>
        <p>General Questions. <br></br></p>

        <ul>
            <li><b>Why have i suddenly been signed out?</b></li>
            <p>This is due to sessions being saved in localstorage. When an update is pushed, localstorage is wiped with no control</p>
            <li><b>I've forgotten my login!!!</b></li>
            <p>Text on telegram. I will be able to aid in recovering your account</p>
        </ul>

        <Button type="primary" href="https://t.me/mkflame701" target="_blank" rel="noopener noreferrer">
          Contact on Telegram
        </Button>
      
      </Modal>
    </>
  );
};

export default HelpButton;