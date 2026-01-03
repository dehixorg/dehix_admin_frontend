import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create an Axios instance
let axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Function to initialize Axios with Bearer token
const initializeAxiosWithToken = (token: string | null) => {
  console.log('Initializing axios with token:', token ? 'Token present' : 'No token');
  
  axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log('Axios instance created with headers:', axiosInstance.defaults.headers);
};

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Debug: Log the request and authorization header
    console.log('Axios request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle errors if needed
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export { axiosInstance, initializeAxiosWithToken };
