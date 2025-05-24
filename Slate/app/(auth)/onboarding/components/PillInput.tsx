// components/PillInput.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

type Props = {
  label: string;
  value: string[];
  onChange: (newPills: string[]) => void;
  placeholder?: string;
};

const PillInput = ({
  label,
  value = [],
  onChange,
  placeholder = 'Type something...',
}: Props) => {
  const [inputText, setInputText] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!value.length) setInputText('');
  }, [value]);

  const handleAddPill = () => {
    const trimmed = inputText.trim();
    const lowerTrimmed = trimmed.toLowerCase();

    if (!trimmed) {
      setValidationError('Please enter something.');
    } else if (trimmed.length < 2) {
      setValidationError('Minimum 2 characters.');
    } else if (trimmed.length > 30) {
      setValidationError('Maximum 30 characters.');
    } else if (value.some(p => p.toLowerCase() === lowerTrimmed)) {
      setValidationError('That’s already added.');
    } else {
      onChange([...value, trimmed]);
      setValidationError('');
    }

    setInputText('');
    Keyboard.dismiss();
  };

  const handleRemovePill = (pill: string) => {
    const updated = value.filter((p) => p !== pill);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.pillsContainer}>
        {value.map((pill, idx) => (
          <TouchableOpacity
            key={`${pill}-${idx}`}
            style={styles.pill}
            onPress={() => handleRemovePill(pill)}
            activeOpacity={0.7}
          >
            <Text style={styles.pillText}>{pill}</Text>
            <Text style={styles.removePillText}>×</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputRow}>
        <RNTextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setValidationError(''); // Clear error on typing
          }}
          onSubmitEditing={handleAddPill}
          blurOnSubmit={false}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPill}
          disabled={!inputText.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}
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
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  errorText: {
    color: '#DC2626', // red-600
    marginTop: 4,
    fontSize: 13,
  },
  
});
