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
  value: externalValue,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: Props) => {
  const [internalValue, setInternalValue] = useState(externalValue.toString());
  const [sliderValue, setSliderValue] = useState(externalValue);
  const isInteracting = useRef(false);

  // Update local state only when not interacting
  useEffect(() => {
    if (!isInteracting.current) {
      setInternalValue(externalValue.toString());
      setSliderValue(externalValue);
    }
  }, [externalValue]);

  const handleSliderChange = (val: number) => {
    isInteracting.current = true;
    setSliderValue(val);
    setInternalValue(val.toString());
  };

  const handleSliderComplete = (val: number) => {
    isInteracting.current = false;
    onChange(val);
  };

  const handleInputChange = (text: string) => {
    setInternalValue(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setSliderValue(parsed);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(internalValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setInternalValue(clamped.toString());
      setSliderValue(clamped);
      onChange(clamped);
    } else {
      // Reset to last known good value
      setInternalValue(externalValue.toString());
    }
    isInteracting.current = false;
  };

  const handleInputFocus = () => {
    isInteracting.current = true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={sliderValue}
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
            value={internalValue}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
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
