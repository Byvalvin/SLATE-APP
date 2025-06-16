// app/program/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions, // Import Dimensions
  Platform, // Import Platform for iOS/Android specific styling
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { server } from '@/constants/API';
import { getAccessToken } from '@/utils/token';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonthItem } from './components/MonthItem'; // Make sure this path is correct

// Get screen dimensions for relative sizing (as in ProgramsScreen)
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper to get relative font size
const getFontSize = (size: number) => screenWidth * (size / 375); // Assuming base width of 375 for scaling

// Helper to get relative spacing
const getWidth = (size: number) => screenWidth * (size / 375);
const getHeight = (size: number) => screenHeight * (size / 812); // Assuming base height of 812 for scaling

const ProgramDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [program, setProgram] = useState<any>(null);
  const [exerciseMap, setExerciseMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const token = await getAccessToken();

        const programRes = await fetch(`${server}/api/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const programData = await programRes.json();
        setProgram(programData);

        const allIds = new Set<string>();
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        programData.months?.forEach((month: any) => {
          days.forEach(day => {
            month.weekly_plan?.[day]?.forEach((ex: any) => {
              if (ex.exercise_id) allIds.add(ex.exercise_id);
            });
          });
        });

        const idArray = Array.from(allIds);
        if (idArray.length > 0) {
          const query = idArray.join(',');
          const exerciseRes = await fetch(`${server}/api/exercises/by-ids?ids=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const exerciseList = await exerciseRes.json();
          const map = exerciseList.reduce((acc: any, ex: any) => {
            acc[ex.exerciseId] = ex;
            return acc;
          }, {});
          setExerciseMap(map);
        }
      } catch (err) {
        console.error('Error fetching program or exercises:', err);
        // You might want to set an error state here to display to the user
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only fetch if ID is available
      fetchProgram();
    } else {
      setLoading(false); // If no ID, stop loading and show 'not found'
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005B44" />
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Program not found or failed to load.</Text>
        <TouchableOpacity style={styles.backButtonBottom} onPress={() => router.push('/programs')}>
           <Text style={styles.backButtonText}>Go Back</Text>
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

       
        <View style={styles.programOverviewCard}>
          <Text style={styles.programName}>{program.name}</Text>
          <Text style={styles.programSubtitle}>{program.meta?.focusTag || program.focus || 'Vitality'}</Text> 
          <Text style={styles.programDescription}>{program.description || 'A well-rounded program to build overall fitness, combining strength, cardio, and flexibility for improved health and wellness.'}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Duration:</Text>
            <Text style={styles.metaValue}>{program.duration_months || '?'} months</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Focus:</Text>
            <Text style={styles.metaValue}>{program.focus || 'General Fitness'}</Text>
          </View>
        </View>

       
        <View style={styles.monthsContainer}>
          {program.months?.length > 0 ? (
            program.months.map((month: any, index: number) => (
              <MonthItem
                key={month.month_number || index} // Use index as fallback key
                month={month}
                exerciseMap={exerciseMap}
              />
            ))
          ) : (
            <Text style={styles.noPlanText}>No training plan available for this program.</Text>
          )}
        </View>
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
    backgroundColor: '#F7F3EF', // Match main background
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
    marginTop: Platform.OS === 'ios' ? getHeight(10) : getHeight(20), // Adjust for iOS notch / Android status bar
    marginBottom: getHeight(10),
    marginLeft: -getWidth(8), // Adjust to align with content padding
  },
  backButtonText: {
    fontSize: getFontSize(16),
    color: '#374151',
    fontWeight: '500',
    marginLeft: getWidth(2),
  },
  programOverviewCard: {
    backgroundColor: '#FFFFFF', // White background for the card
    borderRadius: getWidth(12),
    padding: getWidth(20),
    marginBottom: getHeight(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(6),
    elevation: 3,
  },
  programName: {
    fontSize: getFontSize(24),
    fontWeight: '700', // Bold
    color: '#1F2937',
    marginBottom: getHeight(4),
  },
  programSubtitle: {
    fontSize: getFontSize(16),
    fontWeight: '500',
    color: '#005B44', // Vitality color
    marginBottom: getHeight(10),
  },
  programDescription: {
    fontSize: getFontSize(14),
    color: '#374151',
    lineHeight: getFontSize(20),
    marginBottom: getHeight(15),
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: getHeight(4),
  },
  metaLabel: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: '#6B7280',
    marginRight: getWidth(5),
  },
  metaValue: {
    fontSize: getFontSize(13),
    color: '#374151',
  },
  monthsContainer: {
    marginBottom: getHeight(30), // Spacing at the bottom of the month list
  },
  noPlanText: {
    fontSize: getFontSize(15),
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: getHeight(20),
  },
  backButtonBottom: { // For the "Go Back" button when program not found
    marginTop: getHeight(20),
    paddingVertical: getHeight(10),
    paddingHorizontal: getWidth(20),
    backgroundColor: '#005B44',
    borderRadius: getWidth(8),
  },
  
});

export default ProgramDetail;