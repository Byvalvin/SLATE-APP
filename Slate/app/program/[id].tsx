import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { servers } from '@/constants/API';
import { getAccessToken } from '@/utils/token';

const ProgramDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [exercisesMap, setExercisesMap] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramWithExercises = async () => {
      try {
        const token = await getAccessToken();

        // Step 1: Fetch Program
        const res = await fetch(`${servers[2]}/api/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const programData = await res.json();
        setProgram(programData);

        // Step 2: Extract unique exercise IDs
        const allExerciseIds = new Set<string>();
        programData.months?.forEach((month: any) => {
          Object.values(month.weekly_plan || {}).forEach((dayPlan: any) => {
            dayPlan.forEach((ex: any) => allExerciseIds.add(ex.exercise_id));
          });
        });

        if (allExerciseIds.size > 0) {
          const ids = Array.from(allExerciseIds).join(',');
          const exerciseRes = await fetch(`${servers[2]}/api/exercises/by-ids?ids=${ids}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const exerciseData = await exerciseRes.json();

          // Map exercises by ID for quick lookup
          const map: { [key: string]: any } = {};
          exerciseData.forEach((ex: any) => {
            map[ex.exerciseId] = ex;
          });
          setExercisesMap(map);
        }
      } catch (err) {
        console.error('Error fetching program or exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramWithExercises();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#005B44" />;
  }

  if (!program) {
    return <Text style={{ marginTop: 100, textAlign: 'center' }}>Program not found.</Text>;
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#111827" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: program.meta?.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image' }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{program.name}</Text>
        <Text style={styles.tag}>{program.meta?.focusTag}</Text>
        <Text style={styles.description}>{program.description || 'No description available.'}</Text>
        <Text style={styles.meta}>Duration: {program.duration_months || '?'} months</Text>
        <Text style={styles.meta}>Focus: {program.focus || 'N/A'}</Text>
      </View>

      {program.months?.length > 0 ? (
        program.months.map((month: any) => (
          <View key={month.month_number} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>Month {month.month_number}</Text>
            {month.description && <Text style={styles.monthDescription}>{month.description}</Text>}

            {daysOfWeek.map((day) => {
              const dayPlan = month.weekly_plan?.[day];
              if (!dayPlan || dayPlan.length === 0) return null;

              return (
                <View key={day} style={styles.dayContainer}>
                  <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  {dayPlan.map((exercise: any, index: number) => {
                    const details = exercisesMap[exercise.exercise_id];

                    return (
                      <View key={index} style={styles.exerciseItem}>
                        <Text style={styles.exerciseText}>• {details?.name || exercise.exercise_id}</Text>
                        <Text style={styles.exerciseMeta}>
                          {exercise.sets} sets × {exercise.reps} reps
                        </Text>
                        {details?.image_url && (
                          <Image
                            source={{ uri: details.image_url }}
                            style={{ width: 100, height: 70, borderRadius: 6, marginTop: 4 }}
                          />
                        )}
                        {exercise.notes && <Text style={styles.exerciseNotes}>💬 {exercise.notes}</Text>}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ))
      ) : (
        <Text style={styles.noPlanText}>No training plan available.</Text>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  image: { width: '100%', height: 220 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  tag: { fontSize: 16, color: '#6B7280', marginBottom: 10 },
  description: { fontSize: 15, color: '#374151', marginBottom: 10 },
  meta: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  monthContainer: { paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: '#E5E7EB' },
  monthTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  monthDescription: { fontSize: 14, color: '#4B5563', marginBottom: 6 },
  dayContainer: { marginBottom: 10 },
  dayTitle: { fontSize: 16, fontWeight: '500', color: '#10B981' },
  exerciseItem: { marginLeft: 10, marginTop: 4 },
  exerciseText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  exerciseMeta: { fontSize: 14, color: '#6B7280' },
  exerciseNotes: { fontSize: 13, fontStyle: 'italic', color: '#9CA3AF' },
  noPlanText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', marginVertical: 20 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#111827',
  },
});

export default ProgramDetail;
