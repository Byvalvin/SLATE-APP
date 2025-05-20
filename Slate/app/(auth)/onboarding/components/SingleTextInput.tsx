// components/SingleTextInput.tsx

import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
};

const SingleTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        value={value ?? ''} // ✅ Fix: ensure value is always a string
        onChangeText={onChangeText}
        placeholderTextColor="#6B7280"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'} // for Android
        autoCorrect={false}
        autoCapitalize="sentences"
      />
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
});
