import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
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
  multiline: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    marginTop: 4,
    color: '#DC2626',
    fontSize: 12,
  },
});
