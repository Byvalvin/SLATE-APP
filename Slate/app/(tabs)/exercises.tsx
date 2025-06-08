import { servers } from '@/constants/API';
import { getAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
}


// --- Card Component ---
const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  title,
  subtitle,
  primaryImageUrl,
  fallbackImageUrl,
  onPress,
}) => {
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
  );
};

// --- Section Component ---
const ExerciseSection: React.FC<ExerciseSectionProps> = ({ title, data}) => (
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

// --- Main Screen Component ---
const ExerciseScreen: React.FC = () => {
  const [groupedExercises, setGroupedExercises] = useState<Record<string, ExerciseCardProps[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1); // Pagination state
  const [isFetching, setIsFetching] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      setIsFetching(true);
      try {
        const token = await getAccessToken();
        const res = await fetch(`${servers[2]}/api/exercises/search?query=${searchQuery}&category=${selectedCategory}&page=${page}&limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const transformed = data.data.reduce((acc: Record<string, ExerciseCardProps[]>, e:any) => {
          const category = e.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            id: e.exerciseId,
            title: e.name,
            subtitle: `${e.primary_muscles?.[0] ?? 'Unknown'} muscle`,
            primaryImageUrl: e.realistic_image_url || '',
            fallbackImageUrl: e.image_url || '',
          });
          return acc;
        }, {});

        setGroupedExercises(prevState => ({
          ...prevState,
          ...transformed,
        }));

      } catch (err) {
        console.error('Failed to load exercises', err);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchExercises();
  }, [page, searchQuery, selectedCategory]);

  const handleSearchSubmit = () => {
    setPage(1); // Reset page on new search
    setGroupedExercises({});
  };

  const handleEndReached = () => {
    if (!isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
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
          CATEGORY_ORDER.filter(category => groupedExercises[category]) // Only include ones that exist
            .map(category => (
              <ExerciseSection
                key={category}
                title={category}
                data={groupedExercises[category]}
              />
            ))
        )}
        
        <FlatList
          data={Object.values(groupedExercises).flat()}
          renderItem={({ item }) => <ExerciseCard {...item} />}
          keyExtractor={(item) => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5} // Trigger load more when reaching 50% of the list
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          horizontal
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

  flatListContent: {
    paddingBottom: getHeight(20),
  },
});


export default ExerciseScreen;
