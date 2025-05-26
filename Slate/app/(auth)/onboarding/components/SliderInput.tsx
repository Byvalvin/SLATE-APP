import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  value: number;
  onChangeEnd: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
};

const SliderInput = ({
  label,
  value,
  onChangeEnd,
  min,
  max,
  step = 1,
  unit,
}: Props) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const isInteractingRef = useRef(false);

  useEffect(() => {
    if (!isInteractingRef.current) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleSliderChange = (values: number[]) => {
    const val = values[0];
    isInteractingRef.current = true;
    setDisplayValue(val.toString());
  };

  const handleSliderComplete = (values: number[]) => {
    const val = values[0];
    isInteractingRef.current = false;
    const clamped = Math.max(min, Math.min(max, val));
    setDisplayValue(clamped.toString());
    onChangeEnd(clamped);
  };

  const handleInputChange = (text: string) => {
    isInteractingRef.current = true;
    setDisplayValue(text);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(displayValue, 10);
    let finalValue = value;

    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setDisplayValue(clamped.toString());
      finalValue = clamped;
    } else {
      setDisplayValue(value.toString());
    }

    onChangeEnd(finalValue);
    isInteractingRef.current = false;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderRow}>
        <MultiSlider
          values={[parseInt(displayValue) || min]}
          min={min}
          max={max}
          step={step}
          onValuesChange={handleSliderChange}
          onValuesChangeFinish={handleSliderComplete}
          sliderLength={screenWidth * 0.6}
          selectedStyle={{ backgroundColor: '#55F358' }}
          unselectedStyle={{ backgroundColor: '#D1D5DB' }}
          markerStyle={{
            backgroundColor: '#55F358',
            borderWidth: 1,
            borderColor: '#999',
            height: 20,
            width: 20,
            borderRadius: 10,
          }}
        />

        <View style={styles.valueBox}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={displayValue}
            onChangeText={handleInputChange}
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
    marginBottom: screenHeight * 0.03,
  },
  label: {
    fontSize: screenWidth * 0.04,
    fontWeight: '300',
    marginBottom: screenHeight * 0.01,
    color: '#111827',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueBox: {
    width: screenWidth * 0.2,
    marginLeft: screenWidth * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.008,
    borderRadius: screenWidth * 0.015,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: screenWidth * 0.035,
    fontWeight: '600',
    color: '#1F2937',
    padding: 0,
    textAlign: 'right',
  },
  unitText: {
    marginLeft: screenWidth * 0.01,
    fontSize: screenWidth * 0.035,
    color: '#374151',
  },
});
