import { refreshAccessToken, getAccessToken } from '@/utils/token';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let token = await getAccessToken();
    if (!token) throw new Error('No access token');
  
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.status === 403) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error('Token refresh failed');
  
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  
    return res;
  }
  