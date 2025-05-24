import React, { useState, useEffect, useRef } from 'react';
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
