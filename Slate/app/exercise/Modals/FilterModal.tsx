import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (category: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}

const FilterModal: React.FC<Props> = ({
  visible,
  onClose,
  onApply,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Filter by Category</Text>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.item,
                selectedCategory === category && styles.selectedItem,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.itemText}>{category}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onApply(selectedCategory)}>
              <Text style={styles.apply}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#E5F4EC',
  },
  itemText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancel: {
    color: '#888',
  },
  apply: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
