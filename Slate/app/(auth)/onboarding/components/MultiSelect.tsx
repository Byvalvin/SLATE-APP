import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'; // Import Dimensions

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  options: string[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
};

const MultiSelect = ({ label, options, value, onChange }: Props) => {
  const handleToggleSelection = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option)); // Remove
    } else {
      onChange([...value, option]); // Add
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, value.includes(option) && styles.selectedOption]}
            onPress={() => handleToggleSelection(option)}
          >
            <Text
              style={[styles.optionText, value.includes(option) && styles.selectedText]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MultiSelect;

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.03, // Relative margin bottom (e.g., 3% of screen height)
  },
  label: {
    fontSize: screenWidth * 0.035, // Relative font size (e.g., 3.5% of screen width)
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom (e.g., 1% of screen height)
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'column',
    marginBottom: screenHeight * 0.015, // Relative margin bottom (e.g., 2% of screen height)
    maxHeight: screenHeight * 0.23, // Added a maxHeight to prevent it from taking too much vertical space
  },
  option: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding (e.g., 4% of screen width)
    paddingVertical: screenHeight * 0.015, // Relative vertical padding (e.g., 1.5% of screen height)
    borderRadius: screenWidth * 0.02, // Relative border radius (e.g., 2% of screen width)
    marginBottom: screenHeight * 0.01, // Relative margin bottom (e.g., 1% of screen height)
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: screenWidth * 0.04, // Relative font size (e.g., 4% of screen width)
    color: '#1F2937',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
