import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions, // Import Dimensions
} from 'react-native';
import Slider from '@react-native-community/slider';

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
};

const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: Props) => {
  const [internalValue, setInternalValue] = useState(value); // Slider value
  const [inputValue, setInputValue] = useState(value.toString()); // Text input
  const isSliding = useRef(false);
  const isFocusing = useRef(false);

  // Sync from parent unless user is interacting
  useEffect(() => {
    // Update both internal and input values when parent value changes (even initially)
    const stringified = value.toString();
    setInternalValue(value);
    setInputValue(stringified);
  }, [value]);


  const handleSliderChange = (val: number) => {
    isSliding.current = true;
    setInternalValue(val);
    setInputValue(val.toString());
  };

  const handleSliderComplete = (val: number) => {
    isSliding.current = false;
    onChange(val);
  };

  const handleInputFocus = () => {
    isFocusing.current = true;
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setInternalValue(clamped);
      setInputValue(clamped.toString());
      onChange(clamped);
    } else {
      // Reset to last valid value
      setInternalValue(value);
      setInputValue(value.toString());
    }
    isFocusing.current = false;
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setInternalValue(parsed);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={internalValue}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderComplete}
          step={step}
          minimumTrackTintColor="#55F358" // Changed to new color
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor={Platform.OS === 'android' ? '#55F358' : undefined} // Changed to new color for Android
        />

        <View style={styles.valueBox}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            maxLength={4}
          />
          {unit && <Text style={styles.unitText}>{unit}</Text>}
        </View>
      </View>
    </View>
  );
};

export default SliderInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.03, // Relative margin bottom (e.g., 3% of screen height)
  },
  label: {
    fontSize: screenWidth * 0.04, // Relative font size (e.g., 4% of screen width)
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom (e.g., 1% of screen height)
    color: '#111827',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: screenHeight * 0.05, // Relative height (e.g., 5% of screen height)
  },
  valueBox: {
    width: screenWidth * 0.2, // Relative width (e.g., 20% of screen width)
    marginLeft: screenWidth * 0.03, // Relative margin left (e.g., 3% of screen width)
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: screenWidth * 0.02, // Relative horizontal padding
    paddingVertical: screenHeight * 0.008, // Relative vertical padding
    borderRadius: screenWidth * 0.015, // Relative border radius
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: screenWidth * 0.035, // Relative font size
    fontWeight: '600',
    color: '#1F2937',
    padding: 0, // Keep padding 0 for TextInput inside valueBox
    textAlign: 'right',
  },
  unitText: {
    marginLeft: screenWidth * 0.01, // Relative margin left
    fontSize: screenWidth * 0.035, // Relative font size
    color: '#374151',
  },
});