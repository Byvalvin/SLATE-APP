import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
import { servers } from '@/constants/API';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_EXP_KEY = 'accessExp';
const REFRESH_EXP_KEY = 'refreshExp';

type JWTPayload = { exp: number };

// Save both tokens + their expiration times
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  const { exp: accessExp } = jwtDecode<JWTPayload>(accessToken);
  const { exp: refreshExp } = jwtDecode<JWTPayload>(refreshToken);

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  await SecureStore.setItemAsync(ACCESS_EXP_KEY, accessExp.toString());
  await SecureStore.setItemAsync(REFRESH_EXP_KEY, refreshExp.toString());
}

export async function getAccessToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const exp = await SecureStore.getItemAsync(ACCESS_EXP_KEY);
  if (!token || !exp) return null;

  const isExpired = Date.now() >= parseInt(exp) * 1000;
  return isExpired ? null : token;
}

export async function getRefreshToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  const exp = await SecureStore.getItemAsync(REFRESH_EXP_KEY);
  if (!token || !exp) return null;

  const isExpired = Date.now() >= parseInt(exp) * 1000;
  return isExpired ? null : token;
}

export async function deleteTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ACCESS_EXP_KEY);
  await SecureStore.deleteItemAsync(REFRESH_EXP_KEY);
}

export async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

  try {
    const response = await fetch(`${servers[1]}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await response.json();
    await saveTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    //await deleteTokens(); // Clear corrupted state
    return null;
  }
}
