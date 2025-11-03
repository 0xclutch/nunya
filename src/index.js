import React from "react";
import ReactDOM from "react-dom/client";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HomePage from './pages/developDashboard.js'
import PinScreen from "./pages/Pin";
import ScanQR from "./pages/ScanQR";
import MainLayout from "./components/MainLayout";
import Settings from "./pages/Settings";
import ManageApp from "./pages/ManageApp";

import { SafeAreaWrapper } from "./components/SafeAreaWrapper";
import GovID from "./pages/GovID";
import ShareID from "./pages/ShareID";
import QRVerification from "./pages/QRVerification";
import ShowUserQR from "./pages/2.0/ShowUserQR.js";
import { SpeedInsights } from "@vercel/speed-insights/react"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SpeedInsights/>
    <Router>
      <AuthProvider>
        <SafeAreaWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />

            {/* HomePage routes - manages its own Navbar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path='/secret' element={<HomePage />} />

            <Route path="/" element={<MainLayout />}> {/* Navbar global attachment for other routes */}
              <Route path="/scan" element={<ScanQR />} />
              <Route path="/settings" element={<Settings />} />
            </Route> 

            {/* Protected Routes */}
            <Route
              path="/pin"
              element={
                <ProtectedRoute>
                  <PinScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/id"
              element={
                <ProtectedRoute>
                  <GovID />
                </ProtectedRoute>
              }
            />

            <Route
              path='/id/showqr'
              element={
                <ProtectedRoute>
                  <ShowUserQR />
                </ProtectedRoute>
              }
            />


            <Route
              path="/id/share"
              element={
                <ProtectedRoute>
                  <ShareID />
                </ProtectedRoute>
              }
            />

            <Route
              path="/id/share/qr"
              element={
                <ProtectedRoute>
                  <QRVerification />
                </ProtectedRoute>
              }
            />

            <Route path="/scan-qr" element={<ScanQR />} />
            <Route path="/settings/manage" element={<ManageApp />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SafeAreaWrapper>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
