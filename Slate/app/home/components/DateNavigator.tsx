import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  onPrev: () => void;
  onNext: () => void;
  displayDate: string;
};

const DateNavigator: React.FC<Props> = ({ onPrev, onNext, displayDate }) => {
  return (
    <View style={styles.dateNavigator}>
      <TouchableOpacity onPress={onPrev}>
        <AntDesign name="left" size={screenWidth * 0.05} color="#000" />
      </TouchableOpacity>
      <Text style={styles.dateText}>{displayDate}</Text>
      <TouchableOpacity onPress={onNext}>
        <AntDesign name="right" size={screenWidth * 0.05} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Date Navigator Styles
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    backgroundColor: '#F2EDE9',
  },
  dateText: {
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
    color: '#000',
  },
});

export default DateNavigator;
