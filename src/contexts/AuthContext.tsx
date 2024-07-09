"use client";
import axiosInstance from "@/axiosConfig";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type AuthContextType = {
  token: string | null;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: object | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  const fetchGithubData = async () => {
    console.log("token");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUserData(null);
      return;
    }
    const res = await axiosInstance.get("/getUserData", {
      headers: {
        Authorization: token,
      },
    });
    console.log("res data 123S", res);
    setUserData(res.data);
  };
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setIsLoggedIn(true);
    }
    fetchGithubData();
  }, [isLoggedIn]);
  const value = {
    token,
    logout,
    isLoggedIn,
    setIsLoggedIn,
    userData,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, useAuth, AuthProvider };
