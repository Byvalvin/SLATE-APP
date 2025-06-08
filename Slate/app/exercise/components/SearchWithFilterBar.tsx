// components/SearchWithFilterBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, PixelRatio, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Updated scaling functions with PixelRatio for cleaner rendering
const getFontSize = (size: number): number => {
  const scale = screenWidth / 375; // Assuming base width of 375 for scaling
  const newSize = size * scale;
  return PixelRatio.roundToNearestPixel(newSize);
};

const getWidth = (size: number): number => {
  const scale = screenWidth / 375;
  return PixelRatio.roundToNearestPixel(scale * size);
};

const getHeight = (size: number): number => {
  const scale = screenHeight / 812; // Assuming base height of 812 for scaling
  return PixelRatio.roundToNearestPixel(scale * size);
};
interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSearchSubmit: () => void;
  onFilterApply: (category: string) => void;
}

const SearchWithFilterBar: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearchSubmit,
  onFilterApply,
}) => {
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
          onSubmitEditing={onSearchSubmit}
        />
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedCategory(selectedCategory)}>
        <MaterialCommunityIcons name="filter-variant" size={getFontSize(24)} color="#6B7280" />
      </TouchableOpacity>

      {selectedCategory && (
        <Text style={styles.selectedCategory}>
          {selectedCategory}
        </Text>
      )}
      
    </View>

  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getWidth(20),
    marginVertical: getHeight(10),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: getWidth(14),
    paddingHorizontal: getWidth(12),
    height: getHeight(35),
  },
  searchIcon: {
    marginRight: getWidth(8),
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#1F2937',
    paddingVertical: getHeight(10),
  },
  filterButton: {
    marginLeft: getWidth(10),
    padding: getWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    marginLeft: getWidth(10),
    fontSize: getFontSize(14),
    color: '#4CAF50',
  },
});

export default SearchWithFilterBar;
