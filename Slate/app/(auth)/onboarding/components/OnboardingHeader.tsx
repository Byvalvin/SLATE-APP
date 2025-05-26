import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed
import { useRouter } from 'expo-router';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void; // Optional custom back handler
};

const OnboardingHeader = ({ currentStep, totalSteps, onBack }: Props) => {
  const router = useRouter();

  // Calculate the width of each progress segment based on screen width
  // Subtracting horizontal padding of the container (screenWidth * 0.05 * 2)
  // and accounting for margins between segments.
  const progressContainerPadding = screenWidth * 0.05; // Matches styles.container.paddingHorizontal
  const totalProgressLineWidth = screenWidth - (progressContainerPadding * 2);
  const segmentMargin = screenWidth * 0.005; // Small margin between segments (2 * 0.005 = 1% of screen width total for margins if many segments)
  // Ensure totalSteps is at least 1 to avoid division by zero or negative width
  const safeTotalSteps = Math.max(1, totalSteps);
  const progressSegmentWidth = (totalProgressLineWidth / safeTotalSteps) - (segmentMargin * (safeTotalSteps > 1 ? 2 : 0) / safeTotalSteps) ;


  const handleBack = () => {
    if (onBack) {
      onBack(); // Use custom handler if provided
    } else if (router.canGoBack()) { // Check if router can go back
      router.back();
    } else {
      // Fallback if router.back() is not possible (e.g., first screen in stack)
      // You might want to navigate to a default screen or do nothing
      console.log("Cannot go back further.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: safeTotalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              {
                width: progressSegmentWidth,
                backgroundColor: index < currentStep ? '#55F358' : '#E5E7EB', // Active vs Inactive color
                marginHorizontal: segmentMargin, // Apply horizontal margin to each segment
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.headerRow}>
        {currentStep > 0 ? ( // Show back button only if not the first step
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={screenWidth * 0.06} color="#333" />
          </TouchableOpacity>
        ) : (
          // Placeholder to keep title centered when back button is not visible
          <View style={{ width: screenWidth * 0.06 + (styles.backButton.padding * 2) }} />
        )}

        <Text style={styles.appTitle}>SLATE</Text>

        {/* Placeholder for symmetry, ensuring title is centered */}
        <View style={{ width: screenWidth * 0.06 + (styles.backButton.padding * 2) }} />
      </View>
    </View>
  );
};

export default OnboardingHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: screenHeight * 0.05,       // Relative top padding (e.g., 5% of screen height for status bar area)
    paddingHorizontal: screenWidth * 0.05,// Relative horizontal padding (e.g., 5% of screen width)
    backgroundColor: '#F9FAFB',           // Light background color (Tailwind gray-50)
    // Removed borderBottomWidth and borderBottomColor
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: screenHeight * 0.015,   // Relative margin (e.g., 1.5% of screen height)
    justifyContent: 'center', // Center segments if they don't fill the width
    alignItems: 'center',
  },
  progressSegment: {
    height: screenHeight * 0.005,         // Relative height (e.g., 0.8% of screen height)
    borderRadius: screenHeight * 0.004,   // Relative border radius (half of height for pill shape)
    // marginHorizontal is now applied inline per segment for better control
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',      // Distribute space between back button, title, and placeholder
    minHeight: screenHeight * 0.03,       // Minimum height for the header row
    marginBottom: screenHeight * 0.01,    // Small margin at the bottom of the header row
  },
  backButton: {
    padding: screenWidth * 0.01,          // Relative padding for touch area
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: screenWidth * 0.06,        // Relative font size (e.g., 4.8% of screen width)
    fontWeight: '600',                    // Semi-bold
    color: '#111827',                     // Dark text color (Tailwind gray-900)
    letterSpacing: 1,
    textAlign: 'center',
  },
});