import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardEvent,
  Dimensions,
} from 'react-native';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (value.length === 0 && inputText !== '') {
      setInputText('');
    }
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
      setInputText('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleRemovePill = (pill: string) => {
    onChange(value.filter(p => p !== pill));
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
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setValidationError('');
          }}
          onSubmitEditing={handleAddPill}
          blurOnSubmit={false}
          returnKeyType="done"
        />

        {!keyboardVisible && !!inputText.trim() && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPill}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: screenHeight * 0.03,
  },
  label: {
    fontSize: screenWidth * 0.04,
    fontWeight: '300',
    marginBottom: screenHeight * 0.01,
    color: '#111827',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: screenHeight * 0.005,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: screenWidth * 0.027,
    paddingVertical: screenHeight * 0.007,
    borderRadius: screenWidth * 0.04,
    marginRight: screenWidth * 0.018,
    marginBottom: screenHeight * 0.01,
  },
  pillText: {
    fontSize: screenWidth * 0.035,
    color: '#1F2937',
  },
  removePillText: {
    fontSize: screenWidth * 0.04,
    color: '#9CA3AF',
    marginLeft: screenWidth * 0.015,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: screenHeight * 0.06,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.012,
    borderRadius: screenWidth * 0.02,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: screenWidth * 0.04,
    color: '#111827',
    textAlignVertical: 'center',
  },
  addButton: {
    marginLeft: screenWidth * 0.02,
    backgroundColor: '#55F358',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.012,
    borderRadius: screenWidth * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: screenWidth * 0.04,
  },
  errorText: {
    color: '#DC2626',
    marginTop: screenHeight * 0.005,
    fontSize: screenWidth * 0.035,
  },
});
