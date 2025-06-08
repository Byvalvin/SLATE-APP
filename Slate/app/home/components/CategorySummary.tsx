import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Exercise } from '../Interfaces';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  exercises: Exercise[];
};

export const CATEGORY_ORDER = ['Legs', 'Chest', 'Back', 'Arms', 'Core', 'Shoulders', 'Glutes'];

const CategorySummary: React.FC<Props> = ({ exercises }) => {
  const groupExercisesByCategory = (exercises: Exercise[]) => {
    const categoryMap: { [category: string]: number } = {};

    exercises.forEach((exercise) => {
      const category = exercise.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return categoryMap;
  };

  const orderedCategories: [string, number][] = Object.entries(
    groupExercisesByCategory(exercises)
  ).sort(([a], [b]) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const renderExerciseBar = (count: number) => {
    /** 
     * We interleave green “segments” with thin white “separators”.
     *  ┌───┬─┬─┐     for   count = 3
     *  │███│ │ │
     *  └───┴─┴─┘
     */
      const items = [];
  
      for (let i = 0; i < count; i++) {
      // green segment
      items.push(
        <View key={`seg-${i}`} style={styles.exerciseBarSegment} />
      );
  
      // separator (don’t add one after the last segment)
        if (i < count - 1) {
          items.push(
          <View key={`sep-${i}`} style={styles.exerciseBarSeparator} />
        );
      }
    }
    return <View style={styles.exerciseBarContainer}>{items}</View>;
    }

  return (
    <View style={styles.categorySelector}>
      {orderedCategories.map(([category, count]) => (
        <View key={category} style={styles.categoryColumn}>
          <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          {renderExerciseBar(count)}
        </View>
      ))}
    </View>
  );
};

export default CategorySummary;

const styles = StyleSheet.create({
    // Category Selector Styles
    categorySelector: {
        backgroundColor: 'white',
        marginHorizontal: screenWidth * 0.05,
        marginTop: -screenHeight * 0.04,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: screenHeight * 0.015,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        zIndex: 1,
    },
    categoryColumn: {
        alignItems: 'center',
    },
    categoryText: {
        fontWeight: '600',
        color: '#999',
        fontSize: screenWidth * 0.035,
        marginBottom: screenHeight * 0.005, // Space between text and bar
    },
    exerciseBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: screenHeight * 0.008,
        borderRadius: 2,
        overflow: 'hidden',
        width: screenWidth * 0.15,
    },

    exerciseBarSegment: {
        flex: 1,                       // each segment grows evenly
        height: '100%',
        backgroundColor: '#58F975',    // green fill
    },

    exerciseBarSeparator: {
        width: 2,                      // tweak thickness here
        height: '100%',
        backgroundColor: '#FFFFFF',    // separator colour
    },
});
