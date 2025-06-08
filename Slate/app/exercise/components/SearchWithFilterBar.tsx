import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, PixelRatio, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModal from '../Modals/FilterModal';

const { width: screenWidth } = Dimensions.get('window');

// Scaling functions remain the same
const getFontSize = (size: number): number => {
  const scale = screenWidth / 375;
  const newSize = size * scale;
  return PixelRatio.roundToNearestPixel(newSize);
};

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSearchSubmit: () => void;
}

const SearchWithFilterBar: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearchSubmit,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleFilterApply = (category: string) => {
    setSelectedCategory(category);
    setShowFilterModal(false);
  };

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={getFontSize(22)} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Find exercises"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearchSubmit} // Ensure this triggers on search submit
        />
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
        <MaterialCommunityIcons name="filter-variant" size={getFontSize(24)} color="#6B7280" />
      </TouchableOpacity>

      {selectedCategory && <Text style={styles.selectedCategory}>{selectedCategory}</Text>}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  filterButton: {
    marginLeft: 15,
  },
  selectedCategory: {
    marginLeft: 15,
    fontSize: 16,
    color: '#4CAF50',
  },
});

export default SearchWithFilterBar;
