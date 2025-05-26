import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'; // Import Dimensions

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SingleSelect = ({ label, options, value, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              value === option && styles.selectedOption,
            ]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SingleSelect;

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.03, // Relative margin bottom (e.g., 3% of screen height)
  },
  label: {
    fontSize: screenWidth * 0.040, // Relative font size (e.g., 4.5% of screen width)
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom (e.g., 1% of screen height)
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: screenHeight * 0.015, // Relative gap (e.g., 1.5% of screen height)
  },
  option: {
    paddingVertical: screenHeight * 0.012, // Relative vertical padding (e.g., 2.2% of screen height)
    paddingHorizontal: screenWidth * 0.05, // Relative horizontal padding (e.g., 5% of screen width)
    borderRadius: screenWidth * 0.03, // Relative border radius (e.g., 3% of screen width)
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenHeight * 0.002 }, // Relative shadow offset height
    shadowOpacity: 0.08,
    shadowRadius: screenWidth * 0.015, // Relative shadow radius
    elevation: 2, // Keep fixed elevation for Android consistency
  },
  selectedOption: {
    borderColor: '#28A745', // Changed to a darker, industry-standard green
    backgroundColor: '#D9F7D9', // A much lighter matching green (kept as is)
  },
  optionText: {
    fontSize: screenWidth * 0.045, // Relative font size (e.g., 4.5% of screen width)
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#28A745', // Changed to a darker, industry-standard green
    fontWeight: '600',
  },
});
