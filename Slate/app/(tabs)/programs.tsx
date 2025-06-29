import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Only Ionicons is used now

import { server } from '@/constants/API';
import { getAccessToken } from '@/utils/token';
import { useRouter } from 'expo-router';
import { SectionSkeleton } from '../exercise/components/ExerciseSectionSkeleton'; // Import the SectionSkeleton

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper to get relative font size
const getFontSize = (size: number) => screenWidth * (size / 375); // Assuming base width of 375 for scaling

// Helper to get relative spacing
const getWidth = (size: number) => screenWidth * (size / 375);
const getHeight = (size: number) => screenHeight * (size / 812); // Assuming base height of 812 for scaling

const ProgramsScreen = () => {
  const [programs, setPrograms] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/programs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch programs');
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const router = useRouter();
  const handleProgramPress = (programId: string) => {
    console.log(programId);
    router.push(`/program/${programId}`);
  };

  // --- Reusable Card Components ---
  const renderCard = (
    programId: string,
    imageUri: string,
    title: string,
    subtitle: string,
    isNew?: boolean
  ) => {
    const validImage =
      imageUri && imageUri.trim() !== ''
        ? imageUri
        : 'https://res.cloudinary.com/dnapppihv/image/upload/v1748430385/default_program_image.png'; // 👈 Add your fallback URL

    return (
      <TouchableOpacity style={styles.card} key={programId} onPress={() => handleProgramPress(programId)}>
        {isNew && (
          <View style={styles.newTag}>
            <Text style={styles.newTagText}>NEW</Text>
          </View>
        )}
        <Image source={{ uri: validImage }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.fullScreenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#005B44" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#005B44" />

      <View style={styles.topGreenBackground}>
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <Text style={styles.activeText}>ACTIVE</Text>
            <View style={styles.lifesumRow}>
              <Text style={styles.lifesumStandardText}>Standard</Text>
              <Ionicons name="chevron-forward" size={getFontSize(20)} color="#fff" />
            </View>
          </View>

          <Image
            source={{
              uri: `https://res.cloudinary.com/dnapppihv/image/upload/v1748430385/male_green_ifnxek.png`,
            }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollViewContent} contentContainerStyle={{ paddingBottom: getHeight(30) }}>
        <View style={styles.curatedInfo}>
          <Ionicons name="sparkles" size={getFontSize(16)} color="#6B7280" />
          <Text style={styles.curatedInfoText}>Curated for you </Text>
        </View>

        {loading ? (
          // Render skeletons while loading
          [...Array(3)].map((_, index) => <SectionSkeleton key={index} />)
        ) : (
          // Render real content after data is fetched
          Object.entries(programs).map(([category, items]) => (
            <View key={category}>
              <Text style={styles.sectionTitle}>{category.toUpperCase()}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {items.map((program) =>
                  renderCard(
                    program.programId || program._id || `${program.name}-${category}`,
                    program.meta.imageUrl,
                    program.name,
                    program.meta.focusTag,
                    program.meta.isNew
                  )
                )}
              </ScrollView>
            </View>
          ))
        )}
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
    zIndex: 1,
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: getWidth(16),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? getHeight(35) : getHeight(65),
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
    height: getHeight(60),
    borderRadius: getWidth(30),
    backgroundColor: '#D9F7D9',
  },
  curatedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F5',
    borderRadius: getWidth(8),
    paddingVertical: getHeight(8),
    paddingHorizontal: getWidth(12),
    marginBottom: getHeight(20),
    marginTop: getHeight(20),
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
    paddingBottom: getHeight(20),
  },
  card: {
    width: getWidth(180),
    height: getHeight(220),
    backgroundColor: '#fff',
    borderRadius: getWidth(12),
    marginRight: getWidth(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(4) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(8),
    elevation: 5,
    overflow: 'hidden',
  },
  newTag: {
    position: 'absolute',
    top: getHeight(10),
    right: getWidth(10),
    backgroundColor: '#55F358',
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
    height: getHeight(154),
    borderTopLeftRadius: getWidth(12),
    borderTopRightRadius: getWidth(12),
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

export default ProgramsScreen;
