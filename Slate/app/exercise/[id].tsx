import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAccessToken } from '@/utils/token';
import { servers } from '@/constants/API';

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
        const res = await fetch(`${servers[2]}/api/exercises/by-ids?ids=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const ex = data[0];
        setExercise(ex);

        // Pre-set image fallback chain
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

    if (id) fetchExercise();
  }, [id]);

  const handleImageError = () => {
    if (imageUri === exercise?.realistic_image_url && exercise?.image_url) {
      setImageUri(exercise.image_url); // Try fallback to image_url
    } else {
      setImageUri(null); // No good image, clear it
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#005B44" />;

  if (!exercise) return <Text style={{ marginTop: 100, textAlign: 'center' }}>Exercise not found.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/exercises')}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{exercise.name}</Text>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onError={handleImageError}
          />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#aaa' }}>No image available</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{exercise.description || 'No description available.'}</Text>

        {exercise.instructions?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.instructions.map((inst: string, idx: number) => (
              <Text key={idx} style={styles.text}>
                {idx + 1}. {inst}
              </Text>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Primary Muscles</Text>
        <Text style={styles.text}>{exercise.primary_muscles?.join(', ') || 'N/A'}</Text>

        <Text style={styles.sectionTitle}>Secondary Muscles</Text>
        <Text style={styles.text}>{exercise.secondary_muscles?.join(', ') || 'N/A'}</Text>

        <Text style={styles.sectionTitle}>Equipment</Text>
        <Text style={styles.text}>{exercise.equipment?.join(', ') || 'None'}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: '#111827',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 6,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
});

export default ExerciseDetail;
