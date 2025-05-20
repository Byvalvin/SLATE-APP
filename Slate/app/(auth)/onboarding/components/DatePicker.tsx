import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
};

const CustomDatePicker = ({ label, value, onChange }: Props) => {
  // Check for valid value or default to the current date
  const initialDate = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(initialDate.getDate());
  const [selectedYear, setSelectedYear] = useState<number>(initialDate.getFullYear());

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    console.log('Selected Month:', month); // Debugging the selected month
    if (selectedDay > getDaysInMonth(month, selectedYear)) {
      setSelectedDay(getDaysInMonth(month, selectedYear));
    }
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    console.log('Selected Day:', day); // Debugging the selected day
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    console.log('Selected Year:', year); // Debugging the selected year
    if (selectedDay > getDaysInMonth(selectedMonth, year)) {
      setSelectedDay(getDaysInMonth(selectedMonth, year));
    }
  };

  // Trigger onChange whenever any of the date values change
  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    console.log('Selected Date:', newDate); // Debugging the selected date
    onChange(newDate);
  }, [selectedMonth, selectedDay, selectedYear]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={handleMonthChange}
          style={styles.picker}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedDay}
          onValueChange={handleDayChange}
          style={styles.picker}
        >
          {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          onValueChange={handleYearChange}
          style={styles.picker}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <Picker.Item key={i} label={`${new Date().getFullYear() - i}`} value={new Date().getFullYear() - i} />
          ))}
        </Picker>
      </View>
      {/* Optional: Displaying selected date directly */}
      <TextInput
        style={styles.selectedDate}
        value={`${months[selectedMonth]} ${selectedDay}, ${selectedYear}`}
        editable={false}
      />
    </View>
  );
};

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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: 56, // Increased height for better visibility
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12, // Slightly more rounded corners
    marginHorizontal: 8,
    paddingHorizontal: 12, // Padding inside the picker
    fontSize: 18, // Larger font for readability
    backgroundColor: '#FFF', // Ensure a white background for the pickers
    shadowColor: '#000', // Shadow for prominence
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  selectedDate: {
    marginTop: 16,
    fontSize: 18,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default CustomDatePicker;
