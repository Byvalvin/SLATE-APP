// app/(auth)/onboarding/_layout.tsx
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { OnboardingProvider } from './context/OnboardingContext';

export default function OnboardingLayout() {
  const router = useRouter();
  const segments = useSegments() as string[]; // 👈 cast to avoid TS warning // e.g. ['(auth)', 'onboarding', 'height_weight']

  useEffect(() => {
    // Redirect only if we're exactly at "/onboarding"
    if (
      Array.isArray(segments) &&
      segments.length === 2 &&             // ['(auth)', 'onboarding']
      segments[1] === 'onboarding'
    ) {
      router.replace('/onboarding/height_weight');
    }
  }, [segments]);

  return (
    <OnboardingProvider>
      <Slot />
    </OnboardingProvider>
  );
}
