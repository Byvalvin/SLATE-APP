import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';

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
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sync input with value prop if it changes
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  const handleSliderChange = (val: number) => {
    setInputValue(val.toString()); // Update the input as the slider moves
    onChange(val); // Update parent state immediately as the slider moves
  };

  const handleBlur = () => {
    // Validate the value when input field loses focus
    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue)) {
      // Clamp the value to be within the min and max range
      const clamped = Math.max(min, Math.min(max, numericValue));
      setInputValue(clamped.toString()); // Update the input field with the clamped value
      onChange(clamped); // Update parent state after validation
    }
    setIsFocused(false); // Mark the field as not focused
  };

  const handleFocus = () => {
    setIsFocused(true); // Mark the field as focused
  };

  const handleInputChange = (text: string) => {
    // Update the input value as the user types
    setInputValue(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={handleSliderChange}
          step={step}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor={Platform.OS === 'android' ? '#3B82F6' : undefined}
        />

        <View style={styles.valueBox}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={handleBlur} // Validate on blur (when user leaves the field)
            onFocus={handleFocus} // Mark as focused when the field is in focus
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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  valueBox: {
    width: 80,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    padding: 0,
    textAlign: 'right',
  },
  unitText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#374151',
  },
});
