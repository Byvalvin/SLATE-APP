import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  text: string;
};

const Note = ({ text }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7E6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
    marginTop: 20,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
