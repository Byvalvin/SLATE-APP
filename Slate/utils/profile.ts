import { servers } from '@/constants/API';
import { getAccessToken } from './token';

export async function hasProfile(): Promise<boolean> {
  const token = await getAccessToken();
  const res = await fetch(`${servers[2]}/api/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok; // 200 = has profile, 404 = no profile
}


export async function submitOnboarding(url: string, formData: Record<string, any>) {
  const token = await getAccessToken();

  const submissionData = {
    ...formData,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionData),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Onboarding failed: ${res.status} - ${errorBody}`);
  }

  return res.json();
}


