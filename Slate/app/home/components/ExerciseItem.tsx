import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Exercise } from '../Interfaces'; // Make sure this exists or define the type here

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ExerciseItemProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
}

const ExerciseItem = ({ exercise, onEdit }: ExerciseItemProps) => {
  return (
    <TouchableOpacity style={styles.exerciseItem} onPress={() => onEdit(exercise)}>
      {exercise.image_url ? (
        <Image
          source={{ uri: exercise.image_url }}
          style={styles.exerciseImagePlaceholder}
        />
      ) : (
        <View style={styles.exerciseImagePlaceholder} />
      )}

      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        <Text style={styles.exerciseReps}>
          {exercise.sets} SET - {exercise.reps} REP
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseItem;

const styles = StyleSheet.create({
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: screenWidth * 0.03,
    marginBottom: screenHeight * 0.01,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseImagePlaceholder: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    backgroundColor: '#E9E2DA',
    borderRadius: 8,
    marginRight: screenWidth * 0.04,
  },
  exerciseDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: '400',
    color: '#333',
    marginBottom: screenHeight * 0.005,
  },
  exerciseReps: {
    fontSize: screenWidth * 0.035,
    color: '#666',
  },
});
