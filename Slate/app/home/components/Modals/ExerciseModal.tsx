// components/ExerciseModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Exercise } from '../../Interfaces';


interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  onDelete?: (id: string) => void;
  initialExercise: Exercise;
}

const CATEGORY_ORDER = ['Legs', 'Chest', 'Back', 'Arms', 'Core', 'Shoulders', 'Glutes'];

const ExerciseModal: React.FC<Props> = ({ visible, onClose, onSave, onDelete, initialExercise }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [category, setCategory] = useState('Legs');

  useEffect(() => {
    if (initialExercise) {
      setName(initialExercise.name);
      setSets(initialExercise.sets.toString());
      setReps(initialExercise.reps.toString());
      setCategory(initialExercise.category || 'Legs');
    } else {
      setName('');
      setSets('3');
      setReps('10');
      setCategory('Legs');
    }
  }, [initialExercise]);

  const handleConfirm = () => {
    const exercise: Exercise = {
      id: initialExercise?.id || Date.now().toString(),
      name,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      isCustom: initialExercise?.isCustom ?? true,
      notes: '',
      category,
    };
    onSave(exercise);
    onClose();
  };

  const handleDelete = () => {
    if (initialExercise && onDelete) {
      Alert.alert('Delete Exercise', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(initialExercise.id);
            onClose();
          }
        }
      ]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{initialExercise ? 'Edit Exercise' : 'Add Exercise'}</Text>
          <TextInput
            placeholder="Exercise Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
            {CATEGORY_ORDER.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
          <TextInput
            placeholder="Sets"
            style={styles.input}
            keyboardType="number-pad"
            value={sets}
            onChangeText={setSets}
          />
          <TextInput
            placeholder="Reps"
            style={styles.input}
            keyboardType="number-pad"
            value={reps}
            onChangeText={setReps}
          />

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>{initialExercise ? 'Save Changes' : 'Add Exercise'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {initialExercise?.isCustom && onDelete && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete Exercise</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  picker: { marginBottom: 10 },
  button: { backgroundColor: '#58F975', padding: 12, borderRadius: 5, marginTop: 8 },
  cancelButton: { backgroundColor: '#ccc' },
  deleteButton: { backgroundColor: 'red' },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
});

export default ExerciseModal;
