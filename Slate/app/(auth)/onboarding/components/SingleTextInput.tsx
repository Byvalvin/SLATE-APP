import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  Dimensions, // Import Dimensions
} from 'react-native';

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  errorText?: string;
  keyboardType?: TextInputProps['keyboardType'];
  returnKeyType?: TextInputProps['returnKeyType'];
};

const SingleTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  onFocus,
  onBlur,
  errorText,
  keyboardType = 'default',
  returnKeyType = 'done',
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          errorText && styles.inputError,
        ]}
        placeholder={placeholder}
        value={value ?? ''}
        onChangeText={onChangeText}
        placeholderTextColor="#6B7280"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCorrect={false}
        autoCapitalize="sentences"
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

export default SingleTextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.03, // Relative margin bottom (e.g., 3% of screen height)
  },
  label: {
    fontSize: screenWidth * 0.04, // Relative font size (e.g., 4.5% of screen width)
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom (e.g., 1% of screen height)
    color: '#111827',
  },
  input: {
    height: screenHeight * 0.06, // Relative height (e.g., 6% of screen height)
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding (e.g., 4% of screen width)
    borderRadius: screenWidth * 0.02, // Relative border radius (e.g., 2% of screen width)
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: screenWidth * 0.04, // Relative font size (e.g., 4% of screen width)
    color: '#111827',
  },
  multiline: {
    height: screenHeight * 0.15, // Relative height for multiline (e.g., 15% of screen height)
    paddingTop: screenHeight * 0.015, // Relative padding top
    paddingBottom: screenHeight * 0.015, // Relative padding bottom
  },
  inputError: {
    borderColor: '#DC2626', // Red color for error border
  },
  errorText: {
    marginTop: screenHeight * 0.005, // Relative margin top
    color: '#DC2626', // Red color for error text
    fontSize: screenWidth * 0.03, // Relative font size
  },
});
