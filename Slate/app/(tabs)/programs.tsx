import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform, // Import Platform for conditional padding
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Only Ionicons is used now

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper to get relative font size
const getFontSize = (size: number) => screenWidth * (size / 375); // Assuming base width of 375 for scaling

// Helper to get relative spacing
const getWidth = (size: number) => screenWidth * (size / 375);
const getHeight = (size: number) => screenHeight * (size / 812); // Assuming base height of 812 for scaling

const LifesumCloneScreen = () => {
  // --- Reusable Card Components ---
  const renderCard = (
    imageUri: string,
    title: string,
    subtitle: string,
    isNew?: boolean,
  ) => (
    <TouchableOpacity style={styles.card}>
      {}
      {isNew && (
        <View style={styles.newTag}>
          <Text style={styles.newTagText}>NEW</Text>
        </View>
      )}
      {}
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text> {}
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullScreenContainer}>
      {}
      <StatusBar barStyle="light-content" backgroundColor="#005B44" />

      {}
      <View style={styles.topGreenBackground}>
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <Text style={styles.activeText}>ACTIVE</Text>
            <View style={styles.lifesumRow}>
              <Text style={styles.lifesumStandardText}>Standard</Text>
              <Ionicons name="chevron-forward" size={getFontSize(20)} color="#fff" />
            </View>
          </View>
          {}
          <Image
            source={{ uri: `https://res.cloudinary.com/dnapppihv/image/upload/v1748430385/male_green_ifnxek.png` }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {}
      <ScrollView style={styles.scrollViewContent} contentContainerStyle={{ paddingBottom: getHeight(30) }}> 
        
        <View style={styles.curatedInfo}>
          <Ionicons name="sparkles" size={getFontSize(16)} color="#6B7280" />
          <Text style={styles.curatedInfoText}>Curated for you by an expert</Text>
        </View>

       
        <Text style={styles.sectionTitle}>MAINTAINANCE PLANS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/getting_fit_xlbwy0.png`,
            '3 Months to get \nin shape',
            'Vitality',
            true, // isNew
          )}
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/build_muscle_vq4pll.png`,
            'Build Muscle',
            'Performance',
            false,
          )}
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/tone_up_yovjqr.png`,
            'Tone Up',
            'Vitality',
            false,
          )}
        </ScrollView>

        
        <Text style={styles.sectionTitle}>WEIGHT LOSS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/losing_weight_jszw5l.png`,
            '3 Months to lose \nweight',
            'Vitality',
            false, // isNew
          )}
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/lose_belly_fat_gcgejw.png`,
            'Lose Belly Fat',
            'Vitality',
            false,
          )}
        </ScrollView>

        
        <Text style={styles.sectionTitle}>MUSCLE BUILDING</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {renderCard(
            `https://res.cloudinary.com/dnapppihv/image/upload/v1748517622/build_muscle_vq4pll.png`,
            'Gain Strength',
            'Performance',
            false,
          )}
          {renderCard(
            ``,
            'Bulk Up',
            'Advanced',
            false,
          )}
        </ScrollView>

        
        <View style={{ height: getHeight(60) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Overall background color for the rest of the screen
  },
  topGreenBackground: {
    backgroundColor: '#005B44', // The new dark green background color
    paddingHorizontal: getWidth(16),
    paddingBottom: getHeight(50), // Padding at the bottom of the green section
    // Added zIndex to ensure it's above the scroll view if any overlap issues, though unlikely with current layout
    zIndex: 1,
  },
  scrollViewContent: { // New style for the scrollable area below the green header
    flex: 1,
    paddingHorizontal: getWidth(16), // Keep horizontal padding consistent
    // marginTop: -getHeight(20), // Example of pulling scroll content slightly under a curved header if needed
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:Platform.OS === 'android' ? getHeight(35) : getHeight(65), // Adjust for Android status bar
  },
  profileLeft: {
    flexDirection: 'column',
  },
  activeText: {
    fontSize: getFontSize(12),
    color: '#fff',
    fontWeight: '500',
  },
  lifesumRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifesumStandardText: {
    fontSize: getFontSize(22),
    fontWeight: '700',
    color: '#fff',
    marginRight: getWidth(5),
  },
  profileImage: {
    width: getWidth(60),
    height: getHeight(60), // Ensure height matches width for a circle if source image is square
    borderRadius: getWidth(30), // half of width/height
    backgroundColor: '#D9F7D9', // Placeholder background
  },
  curatedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F5', // Light blue/green background
    borderRadius: getWidth(8),
    paddingVertical: getHeight(8),
    paddingHorizontal: getWidth(12),
    marginBottom: getHeight(20),
    marginTop: getHeight(20), // Add margin top to separate from the green header
  },
  curatedInfoText: {
    fontSize: getFontSize(13),
    color: '#6B7280',
    marginLeft: getWidth(8),
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: getHeight(15),
    marginTop: getHeight(10),
  },
  horizontalScroll: {
    paddingBottom: getHeight(20), // Space below cards
  },
  card: {
    width: getWidth(180), // Card width
    height: getHeight(220), // Card height - kept same
    backgroundColor: '#fff',
    borderRadius: getWidth(12),
    marginRight: getWidth(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    overflow: 'hidden', // Clip image and tags
  },
  newTag: {
    position: 'absolute',
    top: getHeight(10),
    right: getWidth(10),
    backgroundColor: '#55F358', // Green color for NEW tag
    borderRadius: getWidth(8),
    paddingHorizontal: getWidth(8),
    paddingVertical: getHeight(4),
    zIndex: 1, // Ensure tag is above the image
  },
  newTagText: {
    color: '#fff', // Changed to white for better contrast on green tag
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%', // Image now takes full width of the card
    height: getHeight(154), // Adjusted height: 154 is 70% of 220 (card height)
    borderTopLeftRadius: getWidth(12), // Keep top corners rounded
    borderTopRightRadius: getWidth(12), // Keep top corners rounded
    // No bottom radius needed here as content is below
    resizeMode: 'cover', // Ensures the image covers the area, cropping if necessary
  },
  cardContent: {
    paddingHorizontal: getWidth(12),
    paddingVertical: getHeight(8), // Adjusted padding slightly for better balance
    flex: 1, // Allows content to take remaining space
    justifyContent: 'space-around', // Distribute space a bit more evenly if title is short
  },
  cardTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getHeight(4), // Slightly reduced margin
  },
  cardSubtitle: {
    fontSize: getFontSize(12),
    color: '#6B7280',
  },
});

export default LifesumCloneScreen;
