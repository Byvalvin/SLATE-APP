import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    gap: 12,
  },
  option: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
  },
  optionText: {
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
