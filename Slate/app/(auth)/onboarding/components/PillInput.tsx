import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string[];
  onChange: (newPills: string[]) => void;
  placeholder?: string;
};

const PillInput = ({ label, value, onChange, placeholder }: Props) => {
  const [inputText, setInputText] = useState('');

  const handleAddPill = () => {
    if (inputText && !value.includes(inputText)) {
      const updatedPills = [...value, inputText];
      onChange(updatedPills);
      setInputText('');
    }
  };

  const handleRemovePill = (pill: string) => {
    const updatedPills = value.filter((item) => item !== pill);
    onChange(updatedPills);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillsContainer}>
        {value.map((pill, index) => (
          <View key={index} style={styles.pill}>
            <Text style={styles.pillText}>{pill}</Text>
            <TouchableOpacity
              style={styles.removePillButton}
              onPress={() => handleRemovePill(pill)}
            >
              <Text style={styles.removePillText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <RNTextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        onSubmitEditing={handleAddPill}
      />
    </View>
  );
};

export default PillInput;

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
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pill: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 14,
    color: '#1F2937',
  },
  removePillButton: {
    marginLeft: 8,
  },
  removePillText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
});
