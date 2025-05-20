import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
