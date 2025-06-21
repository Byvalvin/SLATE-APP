import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions, // Import Dimensions
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

const welcomeImage = require('../assets/images/welcome_image.jpg');

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={welcomeImage} style={styles.welcomeBg}>
        <View style={styles.overlay}>
          <Text style={styles.title}>SLATE</Text>

          <View style={styles.bottomContent}>
            <Text style={styles.subtitle}>Get Personalized Advice</Text>
            <Text style={styles.body}>
              from your own personal AI trainer curated for you.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/legal-screen')}>
              <Text style={styles.buttonText}>GET STARTED</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.footerText, styles.link]}> Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: screenWidth * 0.06, // Make horizontal padding relative
    paddingTop: screenHeight * 0.08, // Add padding at the top for the absolute title
    paddingBottom: screenHeight * 0.04, // Add padding at the bottom for spacing below footer
    justifyContent: 'flex-end', // Push the 'bottomContent' View to the bottom
    alignItems: 'center', // Center items horizontally within the overlay
  },
  title: {
    position: 'absolute', // Position SLATE absolutely
    top: screenHeight * 0.1, // Position from the top (adjust as needed)
    left: 0,
    right: 0, // Use left/right 0 to allow textAlign: 'center' to work across the width
    color: '#fff',
    fontSize: screenWidth * 0.15, // Relative font size
    fontFamily: 'SourceSans3-Bold',
    textAlign: 'center',
    // Remove marginBottom here as it's absolute positioned
  },
  // New container for the content at the bottom
  bottomContent: {
      width: '100%', // Take full width of the overlay (minus padding)
      alignItems: 'center', // Center children within this container
      justifyContent: 'flex-end', // Redundant with overlay, but good practice if this container had flex
  },
  subtitle: {
    color: '#fff',
    fontSize: screenWidth * 0.045, // Relative font size
    fontFamily: 'Poppins-Regular',
    marginBottom: screenHeight * 0.003, // Relative margin bottom
    textAlign: 'center',
  },
  body: {
    color: '#fff',
    fontSize: screenWidth * 0.035, // Relative font size
    marginBottom: screenHeight * 0.03, // Relative margin bottom
    lineHeight: screenHeight * 0.020, // Relative line height
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
     paddingHorizontal: screenWidth * 0.02, // Add horizontal padding to body text to prevent it from touching edges
  },
  button: {
    backgroundColor: '#21BA3B',
    paddingVertical: screenHeight * 0.010, // Relative vertical padding (slightly reduced)
    width: screenWidth * 0.8, // Reduced button width (70% of screen width) - adjust as needed
    borderRadius: screenWidth * 0.02, // Relative border radius
    alignItems: 'center', // Keep text centered inside button
    marginBottom: screenHeight * 0.012, // Relative margin bottom
    // alignSelf: 'center', // No longer needed if parent (bottomContent) centers items
  },
  buttonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04, // Relative font size
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center footer content horizontally
    marginBottom: screenHeight * 0.01, // Relative margin bottom
  },
  footerText: {
    color: '#fff',
    fontSize: screenWidth * 0.035, // Relative font size
    fontFamily: 'Poppins-Regular',
  },
  link: {
    textDecorationLine: 'underline',
  },
});