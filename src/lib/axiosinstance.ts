import axios, { AxiosInstance, AxiosResponse } from "axios";
import { auth } from "@/config/firebaseConfig";
import Cookies from "js-cookie";



// Create an Axios instance
let axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC__BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to initialize Axios with Bearer token
const initializeAxiosWithToken = (token: string | null) => {
  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC__BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          // Force refresh the Firebase ID token
          const newToken = await user.getIdToken(true);

          // Update local storage and the auth header for the retry
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Update the singleton instance for future requests
          initializeAxiosWithToken(newToken);

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear auth state and redirect if on client side
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          Cookies.remove("token");
          Cookies.remove("userType");
          window.location.href = "/auth/login";
        }

      }
    }

    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export { axiosInstance, initializeAxiosWithToken };
