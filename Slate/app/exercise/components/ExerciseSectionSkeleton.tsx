// Skeleton for Exercise Section (SkeletonExerciseSection.tsx)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, PixelRatio } from 'react-native';
import SkeletonCard from './ExerciseCardSkeleton'; // Assuming SkeletonCard is already defined

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Updated scaling functions with PixelRatio for cleaner rendering
const getWidth = (size: number): number => {
  const scale = screenWidth / 375;
  return PixelRatio.roundToNearestPixel(scale * size);
};

const getHeight = (size: number): number => {
  const scale = screenHeight / 812; // Assuming base height of 812 for scaling
  return PixelRatio.roundToNearestPixel(scale * size);
};

export const SectionSkeleton: React.FC = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleSkeleton} />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {[...Array(5)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: getHeight(25), // Consistent margin at the bottom
    paddingHorizontal: getWidth(20), // Same padding as the real content
  },
  sectionHeader: {
    marginBottom: getHeight(12), // Space between title and cards
  },
  sectionTitleSkeleton: {
    width: '40%',
    height: getHeight(20),
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  // Removed paddingLeft from sectionListContent to prevent double padding
});

export default SectionSkeleton;
