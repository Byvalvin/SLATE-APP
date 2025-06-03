// components/MonthItem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const MonthItem = ({ month, exerciseMap }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.monthContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.monthTitle}>
          {expanded ? '▾' : '▸'} Month {month.month_number}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <>
          {month.description && <Text style={styles.monthDescription}>{month.description}</Text>}
          {daysOfWeek.map(day => {
            const dayPlan = month.weekly_plan?.[day];
            if (!dayPlan?.length) return null;

            return (
              <View key={day} style={styles.dayContainer}>
                <Text style={styles.dayTitle}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                {dayPlan.map((exercise: any, index: number) => {
                  const details = exerciseMap[exercise.exercise_id];
                  return (
                    <View key={index} style={styles.exerciseItem}>
                      <Text style={styles.exerciseText}>• {details?.name || exercise.exercise_id}</Text>
                      <Text style={styles.exerciseMeta}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                      {exercise.notes && (
                        <Text style={styles.exerciseNotes}>💬 {exercise.notes}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  monthTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  monthDescription: { fontSize: 14, color: '#4B5563', marginBottom: 6 },
  dayContainer: { marginBottom: 10 },
  dayTitle: { fontSize: 16, fontWeight: '500', color: '#10B981' },
  exerciseItem: { marginLeft: 10, marginTop: 4 },
  exerciseText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  exerciseMeta: { fontSize: 14, color: '#6B7280' },
  exerciseNotes: { fontSize: 13, fontStyle: 'italic', color: '#9CA3AF' },
});

export default MonthItem;