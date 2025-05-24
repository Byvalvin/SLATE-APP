export async function submitOnboarding(url: string, formData: Record<string, any>) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Onboarding failed: ${res.status} - ${errorBody}`);
    }
  
    return res.json(); // or res.text() or nothing depending on your API
  }
  