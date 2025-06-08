// components/MiniWarning.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const messages : string[] = [
    "Stay safe. Go at your own pace.",
    "Perform all exercises safely and at your own pace. Stop if you feel pain or discomfort.",
    "Follow the steps carefully and stop if you feel discomfort.",
    "Consult your physician before starting a new exercise routine." 
];

const MiniWarning = ({ 
    message = messages[0]
}) => {
  return (
    <View style={styles.container}>
      <Feather name="alert-triangle" size={16} color="#FFA500" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default MiniWarning;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8A5E00',
    flex: 1,
  },
});
