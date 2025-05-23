import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
};

const CustomDatePicker = ({ label, value, onChange }: Props) => {
  const initialDate = value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const daysInMonth = getDaysInMonth(month, selectedYear);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const daysInMonth = getDaysInMonth(selectedMonth, year);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  };

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
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
          {Array.from({ length: 100 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <Picker.Item key={i} label={`${year}`} value={year} />;
          })}
        </Picker>
      </View>

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
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
  },
  selectedDate: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
});

export default CustomDatePicker;
