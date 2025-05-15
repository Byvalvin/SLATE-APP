// Slate/app/(auth)/index.tsx
import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text } from 'react-native';
import WelcomeScreen from '../components/WelcomeScreen';
import { getAccessToken, refreshAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const router = useRouter();

  // to decide if user gets login or straight to account
  const checkSession = async () => {
    const accessToken = await getAccessToken();
  
    if (accessToken) {
      // Optionally validate the token on backend
      router.replace('/(tabs)');
    } else {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        router.replace('/(tabs)');
      }
      else {
        // Only show welcome if no valid session
        setShouldShowWelcome(true);
        setIsSessionChecked(true);
        //router.replace('/login'); // only show login if token & refresh both failed
      }
    }
  };
    
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        checkSession(); // check if has a session and go straight to home else default
      });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <StatusBar backgroundColor="#F2EDE9" barStyle="dark-content" />
        <Text style={styles.splashText}>SLATE</Text>
      </Animated.View>
    );
  }

  if (!isSessionChecked && !shouldShowWelcome) {
    // Still checking session, show nothing (or a loader if you want)
    return null;
  }
  
  return <WelcomeScreen />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F2EDE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 4,
    fontFamily: 'SourceSans3-Bold',
  },
});