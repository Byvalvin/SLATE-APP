import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};



const NextButton = ({ onPress, disabled = false, style }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, style]}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{disabled ? 'Answer Required' : 'Next'}</Text>
    </TouchableOpacity>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6', // Blue tone
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#A5B4FC', // Faded/disabled tone
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
