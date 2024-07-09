// src/axiosConfig.js

import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.api_server_url,
});

export default axiosInstance;
