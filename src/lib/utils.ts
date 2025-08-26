import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth";
import Cookies from "js-cookie";

import { initializeAxiosWithToken } from "./axiosinstance";

import { auth, googleProvider } from "@/config/firebaseConfig";
import { clearUser } from "./userSlice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timestamp: string | undefined): string => {
  if (!timestamp) {
    return "";
  }
  const now = new Date();
  const time = new Date(timestamp);
  const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);

  if (secondsAgo < 5) {
    return "just now";
  } else if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo > 1 ? "s" : ""} ago`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else if (weeksAgo < 5) {
    return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
  } else {
    return time.toLocaleString(); // Return the formatted date if it's more than 4 weeks ago
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  } catch (error: any) {
    
    const errorMessage = error.message;

    throw new Error(errorMessage);
  }
};

export const loginGoogleUser = async () => {
  return await signInWithPopup(auth, googleProvider);
};

interface UserClaims {
  [key: string]: any;
}

interface UserJson {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthResult {
  user: UserJson;
  claims: UserClaims;
}

export const getUserData = async (
  userCredential: UserCredential,
): Promise<AuthResult> => {
  try {
    const user = userCredential.user;

    // Get the ID token
    const accessToken = await user.getIdToken();
    // Initialize Axios with the token if needed
    initializeAxiosWithToken(accessToken);

    // Get the token claims
    const tokenResult = await user.getIdTokenResult();
    const claims = tokenResult.claims;

    // Create a plain JSON representation of the user
    const userJson: UserJson = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    const userType = claims.type as string;
    // Storing user type and token in cookies
    Cookies.set("userType", userType, { expires: 1, path: "/" });
    Cookies.set("token", accessToken, { expires: 1, path: "/" });

    // Return the user data and claims as JSON
    return {
      user: userJson,
      claims,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};


//logout function

export const handleLogout = async (dispatch: any, router: any) => {
  try {
    await signOut(auth); 
    dispatch(clearUser()); 

    // Clear cookies
    Cookies.remove("userType");
    Cookies.remove("token");

    // Redirect to login page
    router.replace("/auth/login");

  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};