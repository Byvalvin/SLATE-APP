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
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';

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
    // isLocked prop removed as per request
  ) => (
    <TouchableOpacity style={styles.card}>
      {}
      {isNew && (
        <View style={styles.newTag}>
          <Text style={styles.newTagText}>NEW</Text> {}
        </View>
      )}
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text> {}
        <Text style={styles.cardSubtitle}>{subtitle}</Text> {}
        {}
      </View>
    </TouchableOpacity>
  );

  const renderFastingCard = (
    imageUri: string,
    mealPlanText: string,
    fastingType: string,
    // showShoppingList prop removed as per request
  ) => (
    <TouchableOpacity style={styles.fastingCard}>
      <Image source={{ uri: imageUri }} style={styles.fastingCardImage} />
      <View style={styles.fastingCardContent}>
        {}
        <Text style={styles.fastingCardMealPlanText}>{mealPlanText}</Text> {}
        <Text style={styles.fastingCardFastingType}>{fastingType}</Text> {}
        {}
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
            <Text style={styles.activeText}>ACTIVE</Text> {}
            <View style={styles.lifesumRow}>
              <Text style={styles.lifesumStandardText}>Standard</Text> {}
              <Ionicons name="chevron-forward" size={getFontSize(20)} color="#fff" /> {}
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
      <ScrollView style={styles.scrollViewContent}>
        

        {}
        <Text style={styles.sectionTitle}>BALANCED</Text> {}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {renderCard(
            `https://placehold.co/${getWidth(150)}x${getHeight(150)}/E9E2DA/000?text=Blueberries`,
            'Eat like the world\'s\nlongest-living people', // Text to change: Card 1 Title
            'Vitality', // Text to change: Card 1 Subtitle
            true, // isNew
          )}
          {renderCard(
            `https://placehold.co/${getWidth(150)}x${getHeight(150)}/2D4B4B/fff?text=Sugar+Detox`,
            '21-day Meal Plan', // Text to change: Card 2 Title
            'Sugar Detox', // Text to change: Card 2 Subtitle
            false,
          )}
          {renderCard(
            `https://placehold.co/${getWidth(150)}x${getHeight(150)}/E9E2DA/000?text=Fuel+You`,
            'Fuel your body', // Text to change: Card 3 Title
            'Eat, move, thrive', // Text to change: Card 3 Subtitle
            false,
          )}
        </ScrollView>

        {}
        <Text style={styles.sectionTitle}>FASTING</Text> {}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {renderFastingCard(
            `https://placehold.co/${getWidth(100)}x${getHeight(100)}/2D4B4B/fff?text=Morning+Fast`,
            '21-day Meal Plan', // Text to change: Fasting Card 1 Meal Plan Text
            '16:8 Morning\nfasting', // Text to change: Fasting Card 1 Type
          )}
          {renderFastingCard(
            `https://placehold.co/${getWidth(100)}x${getHeight(100)}/E9E2DA/000?text=Evening+Fast`,
            '21-day Meal Plan', // Text to change: Fasting Card 2 Meal Plan Text
            '16:8 Evening\nfasting', // Text to change: Fasting Card 2 Type
          )}
          {renderFastingCard(
            `https://placehold.co/${getWidth(100)}x${getHeight(100)}/2D4B4B/fff?text=Another+Fast`,
            '21-day Meal Plan', // Text to change: Fasting Card 3 Meal Plan Text
            'Another Fasting\nPlan', // Text to change: Fasting Card 3 Type
          )}
        </ScrollView>

        {}
        <Text style={styles.sectionTitle}>HIGH PROTEIN</Text> {}
        <TouchableOpacity style={styles.takeTheTestCard}>
          {}
          <Image
            source={{ uri: `https://placehold.co/${getWidth(60)}x${getHeight(60)}/D9F7D9/000?text=Test+Icon` }}
            style={styles.takeTheTestImage}
          />
          <View style={styles.takeTheTestContent}>
            <Text style={styles.takeTheTestTitle}>Take the test</Text> {}
            <Text style={styles.takeTheTestSubtitle}>To get help choosing a plan</Text> {}
          </View>
          <Ionicons name="chevron-forward" size={getFontSize(24)} color="#6B7280" />
        </TouchableOpacity>

        {}
        <View style={{ height: getHeight(100) }} />
      </ScrollView>

      {}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Overall background color for the rest of the screen
  },
  topGreenBackground: {
    backgroundColor: '#005B44', // The new dark green background color // Adjust padding for status bar and content
    paddingHorizontal: getWidth(16),
    paddingBottom: getHeight(50), // Padding at the bottom of the green section
  },
  scrollViewContent: { // New style for the scrollable area below the green header
    flex: 1,
    paddingHorizontal: getWidth(16), // Keep horizontal padding consistent
    // No paddingTop here, as the green background handles the top spacing
  },
  // Header styles (no longer needed as header content is directly in topGreenBackground)
  // header: {
  //   marginBottom: getHeight(10),
  // },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:getHeight(65),
    // No marginBottom needed here, it's handled by topGreenBackground's paddingBottom
  },
  profileLeft: {
    flexDirection: 'column',
  },
  activeText: {
    fontSize: getFontSize(12),
    color: '#fff', // Changed to white for contrast on dark green
    fontWeight: '500',
  },
  lifesumRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifesumStandardText: {
    fontSize: getFontSize(22),
    fontWeight: '700',
    color: '#fff', // Changed to white for contrast on dark green
    marginRight: getWidth(5),
  },
  profileImage: {
    width: getWidth(60),
    height: getHeight(60),
    borderRadius: getWidth(30),
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
    height: getHeight(220), // Card height
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
  // lockIconContainer removed as per request
  newTag: {
    position: 'absolute',
    top: getHeight(10),
    right: getWidth(10),
    backgroundColor: '#55F358', // Green color for NEW tag
    borderRadius: getWidth(8),
    paddingHorizontal: getWidth(8),
    paddingVertical: getHeight(4),
    zIndex: 1,
  },
  newTagText: {
    color: '#fff',
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: getHeight(120), // Image takes top portion of card
    borderTopLeftRadius: getWidth(12),
    borderTopRightRadius: getWidth(12),
    resizeMode: 'cover',
  },
  cardContent: {
    padding: getWidth(12),
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getHeight(5),
  },
  cardSubtitle: {
    fontSize: getFontSize(12),
    color: '#6B7280',
  },
  // shoppingListContainer removed as per request
  // shoppingListText removed as per request
  fastingCard: {
    width: getWidth(150),
    height: getHeight(200),
    backgroundColor: '#fff',
    borderRadius: getWidth(12),
    marginRight: getWidth(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  fastingCardImage: {
    width: getWidth(100),
    height: getHeight(100),
    borderRadius: getWidth(50), // Circular image
    marginBottom: getHeight(10),
    resizeMode: 'cover',
  },
  fastingCardContent: {
    alignItems: 'center',
    paddingHorizontal: getWidth(10),
    position: 'relative', // For lock icon positioning
  },
  // fastingCardLockIcon removed as per request
  fastingCardMealPlanText: {
    fontSize: getFontSize(12),
    color: '#6B7280',
    marginBottom: getHeight(5),
  },
  fastingCardFastingType: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  takeTheTestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: getWidth(12),
    paddingVertical: getHeight(15),
    paddingHorizontal: getWidth(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    marginBottom: getHeight(20),
  },
  takeTheTestImage: {
    width: getWidth(50),
    height: getHeight(50),
    borderRadius: getWidth(25),
    marginRight: getWidth(15),
    backgroundColor: '#D9F7D9', // Placeholder background
  },
  takeTheTestContent: {
    flex: 1,
  },
  takeTheTestTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#1F2937',
  },
  takeTheTestSubtitle: {
    fontSize: getFontSize(13),
    color: '#6B7280',
  },
  // bottomNav removed as per request
  // navItem removed as per request
  // navText removed as per request
});

export default LifesumCloneScreen;
