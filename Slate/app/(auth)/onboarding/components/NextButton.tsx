import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  buttonText?: string; // Added an optional prop for custom button text
};

const NextButton = ({ onPress, disabled = false, style, buttonText = 'NEXT' }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, style]}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{disabled ? 'Answer Required' : buttonText}</Text>
    </TouchableOpacity>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  button: {
    // These styles are now based on your LoginScreen's loginButton
    backgroundColor: '#55F358', // Active blue tone from LoginScreen's previous loginButton
    borderRadius: screenWidth * 0.03, // Make border radius relative
    paddingVertical: screenHeight * 0.012,
    paddingBottom:screenHeight * 0.012, // Make padding relative (vertical focus)
    alignItems: 'center', // Relative border radius from LoginScreen's loginButton
    marginBottom: screenHeight * 0.03,
    width: screenWidth * 0.85,
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5B4FC', // Disabled faded tone from LoginScreen's previous disabledLoginButton
  },
  buttonText: {
    // These styles are now based on your LoginScreen's loginButtonText
    color: '#fff',
    fontSize: screenWidth * 0.04, // Relative font size from LoginScreen's loginButtonText
    fontWeight: 'bold', // Font weight from LoginScreen's loginButtonText
  },
});