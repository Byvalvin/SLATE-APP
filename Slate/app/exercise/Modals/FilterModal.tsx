import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (categories: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
}

const FilterModal: React.FC<Props> = ({
  visible,
  onClose,
  onApply,
  selectedCategories,
  setSelectedCategories,
}) => {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Filter by Categories</Text>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.item,
                selectedCategories.includes(category) && styles.selectedItem,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.itemText}>{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => setSelectedCategories([])}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => onApply(selectedCategories)}>
              <Text style={styles.apply}>Apply</Text>
            </TouchableOpacity> */}
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

  clearAllButton: {
  marginTop: 10,
  paddingVertical: 8,
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: '#F87171',
},

clearAllText: {
  color: '#fff',
  fontWeight: '600',
},

});
