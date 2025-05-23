// Slate/app/index.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text } from 'react-native';
import WelcomeScreen from '@/components/WelcomeScreen';
import { deleteTokens, getAccessToken, refreshAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
//import * as SecureStore from 'expo-secure-store';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const router = useRouter();
  
  
  // to decide if user gets login or straight to account
  const checkSession = async () => {
    // deleteTokens()
    const accessToken = await getAccessToken();
  
    if (accessToken) {
      console.log("Access token found, navigating to home.");
      router.replace('/(tabs)');
    } else {
      console.log("No access token found, attempting to refresh token...");
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        router.replace('/(tabs)');
      }
      else {
        console.log("no refreshtoken token. must be new here or refresh expired go to login")
        // Only show welcome if no valid session
        setIsSessionChecked(true);
        //router.replace('/login'); // only show login if token & refresh both failed
      }
    }
  };
  
  // useEffect(() => {
  //   const logTokens = async () => {
  //     const access = await SecureStore.getItemAsync('accessToken');
  //     const refresh = await SecureStore.getItemAsync('refreshToken');
  //     console.log('Access Token on app load:', access);
  //     console.log('Refresh Token on app load:', refresh);
  //   };
  //   logTokens();
  // }, []);
    
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        router.push('/onboarding/height_weight');
        //checkSession(); // check if has a session and go straight to home else default
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

  if (!isSessionChecked) {
    // While session is being checked, you can show a loading indicator
    // return null;  // Or a loading spinner if you'd prefer
    return <ActivityIndicator size="large" color="#0000ff" />;
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