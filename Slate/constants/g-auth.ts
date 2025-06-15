import { sample } from "lodash";
import Constants from 'expo-constants';

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_REDIRECT = `${process.env.PUBLIC_BASE_URL}/api/auth/callback`

export const COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh";
export const COOKIE_MAX_AGE = 20;
export const JWT_EXP_TIME = "20s";
export const REFRESH_EXP = "30d";
export const REFRESH_MAX_AGE = 30*24*60*60;
export const REFRESH_BEFORE_EXP = 60;

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    maxAge: COOKIE_MAX_AGE,
 };

 export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    path: "api/auth/refresh",
    maxAge: REFRESH_MAX_AGE
 }


const clientIds = Constants.expoConfig?.extra || {};

export const clientId = clientIds.googleClientId;
export const clientSecret = clientIds.googleClientSecret;
export const iosClientId = clientIds.googleIOSClientId;
export const androidClientId = clientIds.googleAndroidClientId;