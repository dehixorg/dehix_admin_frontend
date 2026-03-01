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

// Shared promise for token refresh to deduplicate concurrent 401s
let lastRefreshPromise: Promise<string | null> | null = null;

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
    const originalRequest = error?.config;

    // Skip noisy logs for cancellations
    const isCanceled =
      error?.code === "ERR_CANCELED" ||
      error?.name === "CanceledError" ||
      error?.name === "AbortError";

    // If error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isCanceled
    ) {
      originalRequest._retry = true;

      if (!lastRefreshPromise) {
        lastRefreshPromise = (async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              // Force refresh the Firebase ID token
              const newToken = await user.getIdToken(true);

              // Update local storage and the auth header for future requests
              localStorage.setItem("token", newToken);
              Cookies.set("token", newToken, { expires: 1, sameSite: "Strict" });

              // Update the singleton instance for future requests
              initializeAxiosWithToken(newToken);

              return newToken;
            }
            throw new Error("No user found for refresh");
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Clear auth state and redirect if on client side
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              Cookies.remove("token");
              Cookies.remove("userType");
              window.location.href = "/auth/login?expired=true";
            }
            throw refreshError;
          } finally {
            lastRefreshPromise = null;
          }
        })();
      }

      return lastRefreshPromise.then((newToken) => {
        if (!newToken) return Promise.reject(error);

        // Update the auth header for the retry
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };

        // Retry the original request
        return axiosInstance(originalRequest);
      });
    }

    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export { axiosInstance, initializeAxiosWithToken };
