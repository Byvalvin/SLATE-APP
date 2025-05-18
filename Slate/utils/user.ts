import { refreshAccessToken, getAccessToken } from '@/utils/token';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = await getAccessToken();

  if (!token) throw new Error('No access token available');

  const makeRequest = async (accessToken: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

  let res = await makeRequest(token);

  // If access token is expired
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Return an explicit error if token refresh fails
      throw new Error('Session expired. Please log in again.');
    }

    res = await makeRequest(newToken);
  }

  return res;
}
