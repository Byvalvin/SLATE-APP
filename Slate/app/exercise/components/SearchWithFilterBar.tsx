import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, PixelRatio, Dimensions, ScrollView } from 'react-native';
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
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  onSearchSubmit: () => void;
}

const SearchWithFilterBar: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  onSearchSubmit,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleFilterApply = (categories: string[]) => {
    setSelectedCategories(categories);
    setShowFilterModal(false);
    onSearchSubmit(); // refetch & apply filter
  };


  return (
<View style={styles.searchBarContainer}>
  {/* Top Row: Search Input + Filter Icon */}
  <View style={styles.searchBarRow}>
    <View style={styles.searchBar}>
      <MaterialCommunityIcons name="magnify" size={getFontSize(22)} color="#6B7280" style={styles.searchIcon} />
      <TextInput
        placeholder="Find exercises"
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearchSubmit}
      />
    </View>

    <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
      <MaterialCommunityIcons name="filter-variant" size={getFontSize(24)} color="#6B7280" />
    </TouchableOpacity>
  </View>

  {/* Second Row: Filter Chips */}
  {selectedCategories.length > 0 && (
    <View style={styles.selectedCategoriesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectedCategoriesScroll}
      >
        {selectedCategories.map((category) => (
          <View key={category} style={styles.chip}>
            <Text style={styles.chipText}>{category}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )}

  {/* Modal */}
  <FilterModal
    visible={showFilterModal}
    onClose={() => setShowFilterModal(false)}
    onApply={handleFilterApply}
    selectedCategories={selectedCategories}
    setSelectedCategories={setSelectedCategories}
  />
</View>

  );
};


const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  filterButton: {
    marginLeft: 15,
  },

  selectedCategoriesContainer: {
    marginTop: 10,
    maxHeight: 36,
  },

  selectedCategoriesScroll: {
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 2,
  },

  chip: {
    backgroundColor: '#E5F4EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  chipText: {
    color: '#1B5E20',
    fontSize: getFontSize(12),
    fontWeight: '500',
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

  selectedCategory: {
    marginLeft: 15,
    fontSize: 16,
    color: '#4CAF50',
  },

});

export default SearchWithFilterBar;
