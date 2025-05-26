import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Dimensions, // Import Dimensions
} from 'react-native';

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    // Only clear inputText if the parent value becomes empty
    // This prevents clearing input while user is typing and pills are being added
    if (value.length === 0 && inputText !== '') {
      setInputText('');
    }
  }, [value]); // Depend on value

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
      setInputText(''); // Clear input only on successful add
      Keyboard.dismiss();
    }
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
          blurOnSubmit={false} // Keep keyboard open if needed
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
    marginBottom: screenHeight * 0.03, // Relative margin bottom
  },
  label: {
    fontSize: screenWidth * 0.04, // Relative font size
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom
    color: '#111827',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: screenHeight * 0.005, // Relative margin bottom
     
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: screenWidth * 0.027, // Relative horizontal padding
    paddingVertical: screenHeight * 0.007, // Relative vertical padding
    borderRadius: screenWidth * 0.04, // Relative border radius (more rounded)
    marginRight: screenWidth * 0.018, // Relative margin right
    marginBottom: screenHeight * 0.01, // Relative margin bottom
  },
  pillText: {
    fontSize: screenWidth * 0.035, // Relative font size
    color: '#1F2937',
  },
  removePillText: {
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#9CA3AF',
    marginLeft: screenWidth * 0.015, // Relative margin left
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: screenHeight * 0.045, // Relative height
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding
    borderRadius: screenWidth * 0.02, // Relative border radius
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#111827',
  },
  addButton: {
    marginLeft: screenWidth * 0.02, // Relative margin left
    backgroundColor: '#55F358', // Changed to the new green color
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding
    paddingVertical: screenHeight * 0.01, // Relative vertical padding
    borderRadius: screenWidth * 0.02, // Relative border radius
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: screenWidth * 0.04, // Relative font size
  },
  errorText: {
    color: '#DC2626',
    marginTop: screenHeight * 0.005, // Relative margin top
    fontSize: screenWidth * 0.035, // Relative font size
  },
});
