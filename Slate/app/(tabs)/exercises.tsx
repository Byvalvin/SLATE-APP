import { server } from '@/constants/API';
import { getAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  PixelRatio,
  Dimensions,
} from 'react-native';

import { CATEGORY_ORDER } from '../home/components/CategorySummary';
import SearchWithFilterBar from '../exercise/components/SearchWithFilterBar';

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
  primaryImageUrl: string;
  fallbackImageUrl: string;
  onPress?: () => void;
}

interface ExerciseSectionProps {
  title: string;
  data: ExerciseCardProps[];
  onEndReached: () => void;
}

// Define a type for your groupedExercises state
interface GroupedExercises {
  [category: string]: ExerciseCardProps[];
}

// Define the type of categoryPages to include page and isFetching
interface CategoryPage {
  page: number;
  isFetching: boolean;
}

// --- Card Component ---
const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(({ id, title, subtitle, primaryImageUrl, fallbackImageUrl, onPress }) => {
  const [imageUri, setImageUri] = useState(primaryImageUrl);

  const handleImageError = () => {
    if (imageUri !== fallbackImageUrl) {
      console.warn(`Falling back from ${imageUri} to ${fallbackImageUrl}`);
      setImageUri(fallbackImageUrl);
    }
  };

  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/exercise/${id}`)} activeOpacity={0.8}>
      <Image
        source={{ uri: imageUri }}
        style={styles.cardImage}
        onError={handleImageError}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
});

// --- Section Component ---
const ExerciseSection: React.FC<ExerciseSectionProps> = ({ title, data, onEndReached }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
    {data.length > 0 && ( // Only render FlatList if data exists
      <FlatList
        data={data}
        renderItem={({ item }) => <ExerciseCard {...item} />}
        keyExtractor={(item, index) => `${item.id || item.title}-${index}`} // Ensure uniqueness by concatenating id and index
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionListContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5} // Trigger load more when reaching 50% of the list
      />
    )}
  </View>
);



const ExerciseScreen: React.FC = () => {
  const [groupedExercises, setGroupedExercises] = useState<Record<string, ExerciseCardProps[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryPages, setCategoryPages] = useState<Record<string, CategoryPage>>(
    CATEGORY_ORDER.reduce((acc, category) => {
      acc[category] = { page: 1, isFetching: false }; // Initialize with page 1 and isFetching false
      return acc;
    }, {} as Record<string, CategoryPage>)
  );

  const router = useRouter();

  const fetchExercisesForCategory = async (category: string, page: number, searchQuery: string) => {
    setCategoryPages((prev) => ({
      ...prev,
      [category]: { ...prev[category], isFetching: true }, // Set isFetching to true when fetching
    }));
  
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${server}/api/exercises/by-category?page=${page}&limit=5&categories=${category}&searchQuery=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
      if (data[category.toLowerCase()] && Array.isArray(data[category.toLowerCase()])) {
        const exercises = data[category.toLowerCase()]?.map((exercise: any) => ({
          id: exercise.exerciseId,
          title: exercise.name,
          subtitle: exercise.primary_muscles[0],
          primaryImageUrl: exercise.image_url,
          fallbackImageUrl: exercise.realistic_image_url,
          onPress: () => router.push(`/exercise/${exercise.exerciseId}`),
        }));
  
        setGroupedExercises((prevState) => {
          const updatedGroupedExercises = {
            ...prevState,
            [category]: [...(prevState[category] || []), ...exercises],
          };
          return updatedGroupedExercises;
        });
  
        // Disable further fetches if there are fewer than 5 exercises
        if (exercises.length < 5) {
          setCategoryPages((prev) => ({
            ...prev,
            [category]: { ...prev[category], isFetching: false, page: -1 }, // Stop pagination
          }));
        }
      } else {
        // Set empty array when no exercises are found for the category
        setGroupedExercises((prevState) => ({
          ...prevState,
          [category]: [],
        }));
      }
  
    } catch (err) {
      console.error('Failed to load exercises', err);
    } finally {
      setCategoryPages((prev) => ({
        ...prev,
        [category]: { ...prev[category], isFetching: false }, // Set isFetching to false after fetching
      }));
      setLoading(false); // Set loading to false after data is fetched
    }
  };
  
  

  // useEffect to trigger fetching for each category
  useEffect(() => {
    //console.log('useEffect triggered, loading:', loading, 'categoryPages:', categoryPages); // Added log to track the effect
    if (loading) {
      // Fetch exercises for each category on load if they aren't already fetched
      CATEGORY_ORDER.forEach((category) => {
        const { isFetching } = categoryPages[category];
        //console.log(`Checking category: ${category}, isFetching: ${isFetching}`);
        if (!isFetching && (!groupedExercises[category] || groupedExercises[category].length === 0)) {
          fetchExercisesForCategory(category, 1, searchQuery);
        }
      });
    }
  }, [loading, searchQuery, categoryPages]); // Track `categoryPages` to trigger correctly

  const handleEndReached = (category: string) => {
    const currentPage = categoryPages[category].page;
    
    // Prevent further fetches if we have already reached the end (page == -1)
    if (categoryPages[category].isFetching || currentPage === -1) {
      return;
    }
  
    setCategoryPages((prevState) => ({
      ...prevState,
      [category]: {
        page: currentPage + 1, // Increment page
        isFetching: true, // Mark as fetching to prevent duplicate requests
      },
    }));
  
    // Fetch more data for the next page
    fetchExercisesForCategory(category, currentPage + 1, searchQuery);
  };

  const handleSearchSubmit = () => {
    setGroupedExercises({});
    setLoading(true); // Reset loading state
    setCategoryPages(
      CATEGORY_ORDER.reduce((acc, category) => {
        acc[category] = { page: 1, isFetching: false };
        return acc;
      }, {} as Record<string, CategoryPage>)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: getHeight(20) }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>STANDARD</Text>
        </View>

        <SearchWithFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSearchSubmit={handleSearchSubmit}
        />

        {loading ? (
          <Text>Loading exercises...</Text>
        ) : (
          CATEGORY_ORDER.map((category) => (
            <ExerciseSection
              key={category}
              title={category}
              data={groupedExercises[category] || []}
              onEndReached={() => handleEndReached(category)} // Trigger page increment for the category
            />
          ))
        )}
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
  paddingVertical: getHeight(6),     // NEW
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
  noDataText: {
    fontSize: getFontSize(16), // Adjust based on your app's font scaling
    color: '#888',  // A neutral gray color for the message
    textAlign: 'center',  // Center the message
    marginVertical: getHeight(20), // Add some space around the message
    fontWeight: '500', // Medium weight for better visibility
  },

  flatListContent: {
    paddingBottom: getHeight(20),
  },
});


export default ExerciseScreen;
