// SkeletonCard.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, PixelRatio } from 'react-native';

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

const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageSkeleton}></View>
      <View style={styles.cardContent}>
        <View style={styles.titleSkeleton}></View>
        <View style={styles.subtitleSkeleton}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: getWidth(180),
    height: getHeight(220),
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: getWidth(12),
    marginRight: getWidth(18), // Space between cards
    marginBottom: getHeight(5), // Bottom margin for spacing between rows (if any)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    overflow: 'hidden',
  },
  imageSkeleton: {
    width: '100%',
    height: getHeight(154),
    backgroundColor: '#e0e0e0', // Lighter grey for image placeholder
    borderRadius: getWidth(12), // Rounded corners
  },
  cardContent: {
    paddingHorizontal: getWidth(12),
    paddingVertical: getHeight(8),
    flex: 1,
    justifyContent: 'space-around',
  },
  titleSkeleton: {
    width: '70%', // Placeholder width for title
    height: getHeight(16), // Height of title placeholder
    backgroundColor: '#e0e0e0',
    borderRadius: 4, // Rounded corners
  },
  subtitleSkeleton: {
    width: '50%', // Placeholder width for subtitle
    height: getHeight(14), // Height of subtitle placeholder
    backgroundColor: '#e0e0e0',
    borderRadius: 4, // Rounded corners
  },
});

export default SkeletonCard;
