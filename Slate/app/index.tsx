// Slate/app/index.tsx

import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View, Dimensions } from 'react-native'; // Import Dimensions for responsiveness
import WelcomeScreen from '@/components/WelcomeScreen';
import { deleteTokens, getAccessToken, refreshAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
import { hasProfile } from '@/utils/profile';
import LiquidWaveLoader from '@/components/LiquidWaveLoader';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const router = useRouter();

  // Function to decide if user gets login or straight to account based on session and profile
  const checkSession = async () => {
    // deleteTokens(); // Keep this commented out for testing, uncomment for actual token deletion
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
<<<<<<< HEAD
          //router.replace('/(auth)/register');
=======
>>>>>>> parent of 5d1bd2a (test gregister)
          router.replace('/onboarding/height_weight');
        }
      } else {
        console.log("No refresh token. Going to welcome/login screen.");
        setIsSessionChecked(true); // Set to true to show WelcomeScreen
      }
    }
  };

  // Effect to handle the splash screen fade-out and session check
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Duration for the fade-out animation
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        checkSession(); // Call checkSession after splash screen fades out
      });
    }, 1000); // This is the duration the initial "SLATE" splash screen is visible
    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  // Render the initial "SLATE" splash screen
  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <StatusBar backgroundColor="#F2EDE9" barStyle="dark-content" />
        {/* SLATE Text */}
        <Text style={styles.splashText}>SLATE</Text>

      
        {/* Made with text at the bottom */}
        <Text style={styles.madeWithText}>
          made with ❤️ by {'\n'} Daniel & Ahmer
        </Text>
      </Animated.View>
    );
  }

  // Render the LiquidWaveLoader while session is being checked
  if (!isSessionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <LiquidWaveLoader size={120} color="#58F157" />
      </View>
    );
  }

  // Render the WelcomeScreen if no session is found after checking
  return <WelcomeScreen />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F2EDE9', // Light beige background
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Needed for absolute positioning of children
  },
  splashText: {
    fontSize: 94, // Fixed font size to match the desired look
    fontFamily: 'Antic-Regular',
    color: '#333', // Dark gray text color to match the attached image
    fontWeight: 'semibold',
    letterSpacing: 4,
    // Translucent shadow properties adjusted for dark text
    textShadowColor: 'rgba(0, 0, 0, 0.15)', // Black with 25% opacity
    textShadowOffset: { width: 4, height: 4 }, // Fixed offset
    textShadowRadius: 5, // Fixed blur radius
  },
  iAccent: { // Renamed from 'parallelogram' to 'iAccent' for clarity
    position: 'absolute',
    backgroundColor: 'rgba(88, 241, 87, 0.7)', // Green color for the accent
    width: 12, // Fixed width for the 'I' bar
    height: 55, // Fixed height for the 'I' bar
    transform: [
       // Maintains the desired tilted slant
      { rotate: '90deg' } // Rotates the element by 180 degrees
    ],
    borderRadius: 2, // Small border radius for a softer look
    // Positioning to visually align under the 'T' of SLATE
    // These values are estimates and might need fine-tuning for perfect alignment across devices
    top: height / 2 + 10, // Adjusted to compensate for rotation and maintain position
    left: width / 2 + 55, // Remains the same, or slight adjustment may be needed
  },
  madeWithText: {
    position: 'absolute',
    bottom: height * 0.05, // Position 5% from the bottom of the screen (responsive)
    fontSize: width * 0.04, // Responsive font size for this text
    fontFamily: 'Poppins-Regular',
    color: '#333', // Dark gray text color
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F2EDE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
