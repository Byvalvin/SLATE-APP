import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

const SingleSelect = ({ label, options, selectedValue, onSelect }: Props) => {
  return (
    <View style={styles.container}>
  
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedValue === option && styles.selectedOption,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option && styles.selectedOptionText,
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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: '#3B82F6', // Blue border when selected
    backgroundColor: '#E0F2FE', // Light blue background when selected
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#3B82F6', // Blue text when selected
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});
