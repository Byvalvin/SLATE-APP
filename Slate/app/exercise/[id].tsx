// app/exercise/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAccessToken } from '@/utils/token';
import { server } from '@/constants/API';
import MiniWarning from '../home/components/MiniWarning';

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper to get relative font size
const getFontSize = (size: number) => screenWidth * (size / 375); // Assuming base width of 375 for scaling

// Helper to get relative spacing
const getWidth = (size: number) => screenWidth * (size / 375);
const getHeight = (size: number) => screenHeight * (size / 812); // Assuming base height of 812 for scaling

const ExerciseDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${server}/api/exercises/by-ids?ids=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const ex = data[0]; // Assuming the API returns an array even for single ID
        setExercise(ex);

        if (ex?.realistic_image_url) {
          setImageUri(ex.realistic_image_url);
        } else if (ex?.image_url) {
          setImageUri(ex.image_url);
        } else {
          setImageUri(null);
        }

      } catch (err) {
        console.error('Error fetching exercise:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExercise();
    } else {
      setLoading(false); // If no ID, stop loading
    }
  }, [id]);

  const handleImageError = () => {
    // Only try image_url if realistic_image_url was the current one
    if (imageUri === exercise?.realistic_image_url && exercise?.image_url) {
      setImageUri(exercise.image_url);
    } else {
      setImageUri(null); // No good image, clear it
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005B44" />
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Exercise not found or failed to load.</Text>
        <TouchableOpacity style={styles.backButtonBottom} onPress={() => router.push('/exercises')}>
          <Text style={styles.backButtonBottomText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.fullScreen}>
      <ScrollView style={styles.scrollView}>
       
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/programs')}>
          <Ionicons name="chevron-back" size={getFontSize(24)} color="#374151" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

     
        <Text style={styles.title}>{exercise.name}</Text>

  
        <View style={styles.imageCard}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain" // Ensures the whole image is visible
              onError={handleImageError}
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No image available</Text>
            </View>
          )}
        </View>

     
        <View style={styles.warningContainer}>
          <MiniWarning />
        </View>

 
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>{exercise.description || 'No description available for this exercise.'}</Text>
        </View>

      
        {exercise.instructions?.length > 0 && (
          <View style={styles.contentCard}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.instructions.map((inst: string, idx: number) => (
              <Text key={idx} style={styles.listItemText}>
                <Text style={styles.bulletPoint}>• </Text>{inst}
              </Text>
            ))}
          </View>
        )}

      
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Primary Muscles</Text>
          <Text style={styles.text}>{exercise.primary_muscles?.join(', ') || 'N/A'}</Text>
        </View>

   
        {exercise.secondary_muscles?.length > 0 && (
          <View style={styles.contentCard}>
            <Text style={styles.sectionTitle}>Secondary Muscles</Text>
            <Text style={styles.text}>{exercise.secondary_muscles?.join(', ') || 'N/A'}</Text>
          </View>
        )}

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <Text style={styles.text}>{exercise.equipment?.join(', ') || 'None'}</Text>
        </View>

        <View style={{ height: getHeight(30) }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F7F3EF', // Figma background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F3EF',
  },
  errorText: {
    fontSize: getFontSize(16),
    color: '#D32F2F',
    marginBottom: getHeight(10),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: getWidth(20), // Consistent horizontal padding
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // --- ADJUSTED marginTop HERE ---
    marginTop: Platform.OS === 'ios' ? getHeight(40) : getHeight(40), // Increased from 10/20 to 40/30
    marginBottom: getHeight(10),
    marginLeft: -getWidth(8), // Adjust to align with content padding
  },
  backButtonText: {
    fontSize: getFontSize(16),
    color: '#374151',
    fontWeight: '500',
    marginLeft: getWidth(2),
  },
  title: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: getHeight(12),
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getWidth(12),
    marginBottom: getHeight(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(6),
    elevation: 3,
    padding: getWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: getHeight(250),
    borderRadius: getWidth(8),
    backgroundColor: '#F7F3EF',
  },
  noImageContainer: {
    width: '100%',
    height: getHeight(250),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: getWidth(8),
  },
  noImageText: {
    color: '#A0A0A0',
    fontSize: getFontSize(14),
  },
  warningContainer: {
    marginBottom: getHeight(20),
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getWidth(12),
    padding: getWidth(20),
    marginBottom: getHeight(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(6),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getHeight(8),
  },
  text: {
    fontSize: getFontSize(14),
    color: '#374151',
    lineHeight: getFontSize(20),
  },
  listItemText: {
    fontSize: getFontSize(14),
    color: '#374151',
    lineHeight: getFontSize(22),
    marginBottom: getHeight(4),
    paddingLeft: getWidth(5),
  },
  bulletPoint: {
    color: '#005B44',
    fontSize: getFontSize(18),
    lineHeight: getFontSize(22),
  },
  backButtonBottom: {
    marginTop: getHeight(20),
    paddingVertical: getHeight(10),
    paddingHorizontal: getWidth(20),
    backgroundColor: '#005B44',
    borderRadius: getWidth(8),
  },
  backButtonBottomText: {
    fontSize: getFontSize(16),
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default ExerciseDetail;