import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { servers } from '@/constants/API';
import { getAccessToken } from '@/utils/token';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonthItem } from '../program/components/MonthItem';

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

        const programRes = await fetch(`${servers[2]}/api/programs/${id}`, {
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
          const exerciseRes = await fetch(`${servers[2]}/api/exercises/by-ids?ids=${query}`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#005B44" />;
  }

  if (!program) {
    return <Text style={{ marginTop: 100, textAlign: 'center' }}>Program not found.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/programs')}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{program.name}</Text>
          <Text style={styles.tag}>{program.meta?.focusTag}</Text>
          <Text style={styles.description}>{program.description || 'No description available.'}</Text>
          <Text style={styles.meta}>Duration: {program.duration_months || '?'} months</Text>
          <Text style={styles.meta}>Focus: {program.focus || 'N/A'}</Text>
        </View>

        {program.months?.length > 0 ? (
          program.months.map((month: any) => (
            <MonthItem key={month.month_number} month={month} exerciseMap={exerciseMap} />
          ))
        ) : (
          <Text style={styles.noPlanText}>No training plan available.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  tag: { fontSize: 16, color: '#6B7280', marginBottom: 10 },
  description: { fontSize: 15, color: '#374151', marginBottom: 10 },
  meta: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  noPlanText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffffdd',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#111827',
  },
});

export default ProgramDetail;
