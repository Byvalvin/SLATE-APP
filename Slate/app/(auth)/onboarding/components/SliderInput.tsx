import React from 'react';
import { View, Text, StyleSheet, Platform, TextInput } from 'react-native';
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

const SliderInput = ({ label, value, onChange, min, max, step = 1, unit }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onChange}
          step={step}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor={Platform.OS === 'android' ? '#3B82F6' : undefined}
        />

        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{value}{unit ? ` ${unit}` : ''}</Text>
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
    width: 60,
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
