import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
};

const OnboardingHeader = ({ currentStep, totalSteps, onBack }: Props) => {
  const router = useRouter();
  const progressWidth = (screenWidth - 40) / totalSteps;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              {
                width: progressWidth - 4,
                backgroundColor: index < currentStep ? '#3B82F6' : '#E5E7EB',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.headerRow}>
        {currentStep > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} /> // Placeholder to align title
        )}
        
        <Text style={styles.appTitle}>SLATE</Text>

        <View style={{ width: 24 }} />
      </View>

    </View>
  );
};

export default OnboardingHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  progressSegment: {
    height: 6,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 1,
  },
});
