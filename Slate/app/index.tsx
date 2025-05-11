// Slate/app/(auth)/index.tsx
import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text } from 'react-native';
import WelcomeScreen from '../components/WelcomeScreen';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2000);
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