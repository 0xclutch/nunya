import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, } from "../components/AuthContext";
import styled from "styled-components";
import { Form, Input, Button, message, Card, Modal, Spin } from "antd";
import { UserOutlined, LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("/assets/qld-gov-logo.png") no-repeat center center;
  background-size: cover;
  filter: blur(8px);
  z-index: -1;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
`;

const FullScreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 16px;
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 360px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  font-family: 'Roboto', sans-serif;
  margin: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);

  @media (max-width: 600px) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
`;

const StyledText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #f5f5f5;
  margin-top: 8px;
`;

const StyledTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  font-family: 'Roboto', sans-serif;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const AnimatedModal = motion(Modal);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [successUser, setSuccessUser] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  // Parse userData properly from localStorage
  const { userData } = useAuth();

  useEffect(() => {
    // Disable scrolling when login screen is visible
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the component is unmounted or the login process is complete
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Logging in with:', values.email, values.password);
    try {
      const user = await login(values.email, values.password);
      setSuccessUser(user);
      message.success("Login successful!");
      setTimeout(() => setShowLoadingScreen(true), 2000);
      setTimeout(() => {
        setSuccessUser(null);
        setShowLoadingScreen(false);
        navigate("/pin");
      }, 3000);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Background />
      <Overlay />
      <LoginWrapper>
        <StyledCard>
          <Title>Login</Title>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </StyledCard>
      </LoginWrapper>

      <AnimatePresence>
        {successUser && userData && (
          <FullScreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              style={{ textAlign: "center", color: "white" }}
            >
              <StyledTitle>Welcome, {userData.firstname} {userData.lastname}!</StyledTitle>
              <StyledText>You are now signed in.</StyledText>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <CheckCircleOutlined style={{ fontSize: "64px", color: "#52c41a" }} />
              </motion.div>
            </motion.div>
          </FullScreenOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoadingScreen && (
          <FullScreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center", color: "white" }}
            >
              <Spin size="large" style={{ marginBottom: 16 }} />
              <StyledText>Authenticating...</StyledText>
            </motion.div>
          </FullScreenOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;
