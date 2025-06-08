// Slate/app/index.tsx (updated part)

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native'; // Import View
import WelcomeScreen from '@/components/WelcomeScreen';
import { deleteTokens, getAccessToken, refreshAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
import { hasProfile } from '@/utils/profile';
import LiquidWaveLoader from '@/components/LiquidWaveLoader'; // Import your new component


export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const router = useRouter();

  // to decide if user gets login or straight to account
  const checkSession = async () => {
    //deleteTokens();
    const accessToken = await getAccessToken();

    if (accessToken) {
      console.log("Access token found, checking profile...");

      const profileExists = await hasProfile();

      if (profileExists) {
        console.log("Profile exists. Navigating to home.");
        router.replace('/(tabs)');
      } else {
        console.log("No profile found. Redirecting to onboarding.");
        router.replace('/onboarding/height_weight');
      }

    } else {
      console.log("No access token found, attempting to refresh token...");
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        const profileExists = await hasProfile();

        if (profileExists) {
          console.log("Refreshed and profile exists. Navigating to home.");
          router.replace('/(tabs)');
        } else {
          console.log("Refreshed but no profile. Redirecting to onboarding.");
          router.replace('/onboarding/height_weight');
        }
      } else {
        console.log("No refresh token. Going to welcome/login screen.");
        setIsSessionChecked(true); // Set to true to show WelcomeScreen
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
        //router.push('/onboarding/height_weight');
        checkSession(); // check if has a session and go straight to home else default
      });
    }, 300); // This is the duration for the initial "SLATE" splash screen fade out
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

  // This block is executed AFTER the initial splash screen fades out,
  // and BEFORE checkSession() potentially redirects.
  // This is where you put your custom loading spinner.
  if (!isSessionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <LiquidWaveLoader size={120} color="#58F157" /> 
      </View>
    );
  }

  // If session is checked and no redirection happened (i.e., no access token and no refresh token),
  // then show the WelcomeScreen.
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
  loadingContainer: { // New style for the loading spinner container
    flex: 1,
    backgroundColor: '#F2EDE9', // Match your splash screen background
    alignItems: 'center',
    justifyContent: 'center',
  },
});