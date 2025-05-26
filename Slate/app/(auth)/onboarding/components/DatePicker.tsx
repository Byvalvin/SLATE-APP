import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Dimensions } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  value: Date | null; // Can be null initially
  onChange: (date: Date) => void;
};

const CustomDatePicker = ({ label, value, onChange }: Props) => {
  // Ensure initialDate is a valid Date object, otherwise default to current date
  const initialDate = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  const [date, setDate] = useState<Date>(initialDate);
  const [showPicker, setShowPicker] = useState(false); // State to control picker visibility

  // Update internal date state when parent value changes
  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setDate(value);
    }
  }, [value]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    // On iOS, if display is 'spinner', the picker stays inline.
    // We only hide it if the event type is 'set' (user confirmed) or 'dismissed' (Android).
    if (Platform.OS === 'ios' && event.type === 'set') {
      setShowPicker(false); // Hide iOS picker after selection
    } else if (Platform.OS === 'android') {
      setShowPicker(false); // Always hide Android picker after any interaction (set or dismissed)
    }

    if (event.type === 'set') { // 'set' means user confirmed selection
      setDate(currentDate);
      onChange(currentDate); // Notify parent of the new date
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  // Format date for display in the TextInput
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Label text with lighter font weight */}
      <Text style={styles.label}>{label}</Text>

      {/* Pressable TextInput to trigger the date picker */}
      <Pressable onPress={showDatePicker} style={styles.inputContainer}>
        <TextInput
          style={styles.selectedDateInput}
          value={formattedDate}
          editable={false} // Make it non-editable, user interacts via picker
          placeholder="Select Date"
          placeholderTextColor="#888"
        />
      </Pressable>

      {/* Conditional rendering of DateTimePicker */}
      {showPicker && (
        // Wrap DateTimePicker in a View to attempt applying background color
        // Note: Direct background color control for native dialogs (especially Android)
        // is often limited by OS theme, but this might affect iOS 'spinner' mode.
        <View style={styles.pickerBackground}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date" // Can be 'date', 'time', or 'datetime'
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'spinner' for iOS inline, 'default' for Android dialog
            onChange={handleDateChange}
            maximumDate={new Date()} // Optional: Prevent selecting future dates
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.025, // Relative margin bottom
  },
  label: {
    // Changed font weight to '400' for a lighter appearance
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#111827', // Dark text color
  },
  inputContainer: {
    // Style for the pressable area that triggers the picker
    backgroundColor: '#FFFFFF',
    borderRadius: screenWidth * 0.02, // Relative border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateInput: {
    paddingVertical: screenHeight * 0.015, // Relative vertical padding
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#1F2937', // Darker text color
  },
  pickerBackground: {

    backgroundColor: '#55F358', 
    borderRadius: screenWidth * 0.02, 
    marginTop: screenHeight * 0.01, 
  },
});

export default CustomDatePicker;
