// ExerciseScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  PixelRatio,
} from 'react-native';

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

// --- Interfaces ---
interface ExerciseCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress?: () => void;
}

interface ExerciseSectionProps {
  title: string;
  data: ExerciseCardProps[];
  onSeeAll?: () => void;
}

// --- Dummy Data ---
const pullExercises: ExerciseCardProps[] = [
  {
    id: '1',
    title: 'Pull-ups',
    subtitle: '150 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620470/pexels-niko-twisty-12895247_xvqwke.jpg',
  },
  {
    id: '2',
    title: 'Deadlifts',
    subtitle: '400 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620790/pexels-amar-13965339_kdwhjb.jpg',
  },
  {
    id: '3',
    title: 'Bicep Curls',
    subtitle: '100 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620791/pexels-leonardho-1552106_ziwfx8.jpg',
  },
];

const pushExercises: ExerciseCardProps[] = [
  {
    id: '4',
    title: 'Push-ups',
    subtitle: '200 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620791/pexels-dejan-krstevski-724759-1582161_nequjf.jpg',
  },
  {
    id: '5',
    title: 'Bench Press',
    subtitle: '350 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620791/pexels-tima-miroshnichenko-5327556_qoagqq.jpg',
  },
  {
    id: '6',
    title: 'Overhead Press',
    subtitle: '300 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620792/pexels-marcuschanmedia-17898145_tghmkh.jpg',
  },
];

const legExercises: ExerciseCardProps[] = [
  {
    id: '7',
    title: 'Squats',
    subtitle: '450 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620791/pexels-tima-miroshnichenko-5327526_zgyg7e.jpg',
  },
  {
    id: '8',
    title: 'Lunges',
    subtitle: '250 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620792/pexels-victorfreitas-2261477_fqgpav.jpg',
  },
  {
    id: '9',
    title: 'Calf Raises',
    subtitle: '120 kcal',
    imageUrl: 'https://res.cloudinary.com/dnapppihv/image/upload/v1748620792/pexels-ivan-samkov-4162487_bxnyyo.jpg',
  },
];

// --- Card Component ---
const ExerciseCard: React.FC<ExerciseCardProps> = ({ title, subtitle, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} onError={(e) => console.log("Failed to load image:", imageUrl, e.nativeEvent.error)} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Section Component ---
const ExerciseSection: React.FC<ExerciseSectionProps> = ({ title, data, onSeeAll }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ExerciseCard {...item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionListContent}
      />
    </View>
  );
};

// --- Main Screen Component ---
const ExerciseScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: getHeight(20) }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>STANDARD</Text>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={getFontSize(22)} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              placeholder="Find exercises"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter pressed')}>
            <MaterialCommunityIcons name="filter-variant" size={getFontSize(24)} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ExerciseSection
          title="Pull"
          data={pullExercises}
          onSeeAll={() => console.log('See all Pull Exercises')}
        />
        <ExerciseSection
          title="Push"
          data={pushExercises}
          onSeeAll={() => console.log('See all Push Exercises')}
        />
        <ExerciseSection
          title="Leg"
          data={legExercises}
          onSeeAll={() => console.log('See all Leg Exercises')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    paddingHorizontal: getWidth(20),
    paddingTop: getHeight(25),
    paddingBottom: getHeight(3),
    alignItems: 'flex-start', // Align "STANDARD" to the left
  },
  headerTitle: {
    fontSize: getFontSize(16),
    marginTop: getHeight(10), // Increased font size for "STANDARD"
    fontWeight: 'bold',
    color: '#4CAF50',
  },
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
  sectionContainer: {
    marginBottom: getHeight(25),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getWidth(20),
    marginBottom: getHeight(12),
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionListContent: {
    paddingHorizontal: getWidth(20),
  },
  card: {
    width: getWidth(180),
    height: getHeight(220),
    backgroundColor: '#fff',
    borderRadius: getWidth(12),
    marginRight: getWidth(18),
    marginBottom: getHeight(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: getHeight(154),
    resizeMode: 'cover',
  },
  cardContent: {
    paddingHorizontal: getWidth(12),
    paddingVertical: getHeight(8),
    flex: 1,
    justifyContent: 'space-around',
  },
  cardTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getHeight(4),
  },
  cardSubtitle: {
    fontSize: getFontSize(12),
    color: '#6B7280',
  },
});

export default ExerciseScreen;