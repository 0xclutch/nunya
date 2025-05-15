import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import { supabase } from "../components/supabaseClient";


const Settings = () => {
  const { user, userData } = useAuth();


    return (
        <>

        </>
    )
};

export default Settings;