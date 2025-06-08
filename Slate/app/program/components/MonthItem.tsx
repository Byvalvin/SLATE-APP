// app/program/components/MonthItem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is imported

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const getFontSize = (size: number) => screenWidth * (size / 375);
const getWidth = (size: number) => screenWidth * (size / 375);
const getHeight = (size: number) => screenHeight * (size / 812);

interface ExerciseData {
  name: string;
  instructions: string[];
  equipment: string[];
  // Add other relevant exercise properties
}

interface MonthItemProps {
  month: {
    month_number: number;
    focus_tag: string;
    weekly_plan?: {
      monday?: any[];
      tuesday?: any[];
      wednesday?: any[];
      thursday?: any[];
      friday?: any[];
      saturday?: any[];
      sunday?: any[];
    };
  };
  exerciseMap: Record<string, ExerciseData>;
}

const MonthItem: React.FC<MonthItemProps> = ({ month, exerciseMap }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <View style={styles.monthCard}>
      <TouchableOpacity onPress={toggleExpand} style={styles.monthHeader}>
        <Text style={styles.monthTitle}>Month {month.month_number}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-forward'}
          size={getFontSize(20)}
          color="#374151"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.monthContent}>
          <Text style={styles.monthFocusText}>Focus on {month.focus_tag || 'building consistency across strength, cardio, and core.'}</Text>
          {daysOfWeek.map(dayKey => {
            const exercisesForDay = month.weekly_plan?.[dayKey as keyof typeof month.weekly_plan];
            if (!exercisesForDay || exercisesForDay.length === 0) {
              return null;
            }

            return (
              <View key={dayKey} style={styles.daySection}>
              
                <View style={styles.dayTitleContainer}>
                  <Ionicons name="calendar-outline" size={getFontSize(15)} color="#005B44" style={styles.calendarIcon} />
                  <Text style={styles.dayTitle}>{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</Text>
                </View>
                {exercisesForDay.map((exercisePlan: any, exIndex: number) => {
                  const exerciseDetails = exerciseMap[exercisePlan.exercise_id];
                  if (!exerciseDetails) {
                    return (
                      <Text key={exIndex} style={styles.exerciseNameMissing}>
                        {exercisePlan.exercise_name || 'Unknown Exercise'} (Details not found)
                      </Text>
                    );
                  }

                  return (
                    <View key={exIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>
                        <Text style={styles.bullet}>• </Text>{exerciseDetails.name}
                      </Text>
                      {exercisePlan.sets && exercisePlan.reps && (
                        <Text style={styles.exerciseSetsReps}>
                          {exercisePlan.sets} sets × {exercisePlan.reps} reps
                        </Text>
                      )}
                      {exercisePlan.notes && (
                        <View style={styles.exerciseNoteContainer}>
                           <Ionicons name="chatbubble-ellipses-outline" size={getFontSize(12)} color="#6B7280" />
                           <Text style={styles.exerciseNote}>{exercisePlan.notes}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  monthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getWidth(12),
    marginBottom: getHeight(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getWidth(6),
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getHeight(12),
    paddingHorizontal: getWidth(16),
  },
  monthTitle: {
    fontSize: getFontSize(17),
    fontWeight: '600',
    color: '#1F2937',
  },
  monthContent: {
    paddingHorizontal: getWidth(16),
    paddingTop: getHeight(10),
    paddingBottom: getHeight(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  monthFocusText: {
    fontSize: getFontSize(13),
    color: '#6B7280',
    marginBottom: getHeight(10),
    lineHeight: getFontSize(18),
  },
  daySection: {
    marginBottom: getHeight(15), // Increased from 10 to provide more space below day title
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingBottom: getHeight(10), // Increased from 8
  },
  dayTitleContainer: { // New style for the icon and text
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getHeight(6), // Consistent with original dayTitle margin
  },
  calendarIcon: { // Style for the calendar icon
    marginRight: getWidth(6), // Space between icon and text
  },
  dayTitle: {
    fontSize: getFontSize(15),
    fontWeight: '600',
    color: '#005B44',
    // marginBottom: getHeight(6), // Moved to dayTitleContainer
  },
  exerciseItem: {
    marginBottom: getHeight(10), // Increased from 6 to give more vertical space per exercise
  },
  exerciseName: {
    fontSize: getFontSize(13),
    fontWeight: '500',
    color: '#374151',
    lineHeight: getFontSize(18), // **Crucial for preventing text clipping**
    marginBottom: getHeight(1),
  },
  bullet: {
    color: '#005B44',
    fontSize: getFontSize(16),
    lineHeight: getFontSize(18), // Align with exerciseName's lineHeight
  },
  exerciseSetsReps: {
    fontSize: getFontSize(12),
    color: '#6B7280',
    marginLeft: getWidth(12),
  },
  exerciseNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: getWidth(12),
    marginTop: getHeight(1),
  },
  exerciseNote: {
    fontSize: getFontSize(11),
    color: '#6B7280',
    fontStyle: 'italic',
    marginLeft: getWidth(4),
  },
  exerciseNameMissing: {
    fontSize: getFontSize(12),
    color: '#B91C1C',
    fontStyle: 'italic',
    marginBottom: getHeight(5),
  }
});

export { MonthItem };