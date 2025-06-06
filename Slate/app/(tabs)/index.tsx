import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; // Import icons for the date navigator and add button
import { format, addDays, subDays, isToday } from 'date-fns'; // Import date manipulation functions and isToday
import { getAccessToken } from '@/utils/token';
import { servers } from '@/constants/API';
import { fetchWithAuth } from '@/utils/user';
import { Exercise } from '../home/Interfaces';
import AccountModal from '@/components/AccountModal';
import ExerciseItem from '../home/components/ExerciseItem';
import ExerciseModal from '../home/components/Modals/ExerciseModal';
import CategorySummary from '../home/components/CategorySummary';
import WorkoutTimer from '../home/components/WorkoutTimer';
import DateNavigator from '../home/components/DateNavigator';
import EditableStatBox from '../home/components/EditableStatBox';


// LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component.']);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [calories, setCalories] = useState('00'); // Made editable
  const [streak, setStreak] = useState<number | null>(null);

  const [initialMinutes, setInitialMinutes] = useState('45');
  const [totalTime, setTotalTime] = useState(300);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false); // Modal for adding exercise
  const [currentDate, setCurrentDate] = useState(new Date()); // State for the date navigator

  const [exercisesForDay, setExercisesForDay] = useState<Exercise[]>([]);
  // State for adding/editing exercise details
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [tempSets, setTempSets] = useState('3');
  const [tempReps, setTempReps] = useState('10');
  const [tempExerciseName, setTempExerciseName] = useState(''); // For manual input or selection from list
  const [tempCategory, setTempCategory] = useState('Legs'); // Default to 'Legs'


  const [accountVisible, setAccountVisible] = useState(false);
  // Default profile image URL - always use this one
  const defaultProfileImageUrl = `https://res.cloudinary.com/dnapppihv/image/upload/v1748430385/male_green_ifnxek.png`;

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          console.log('No valid access token, redirecting to login');
          //router.replace('/login');   // or however you navigate
          return;
        }

        const res = await fetchWithAuth(`${servers[2]}/api/auth/me`);

        if (res.ok) {
          const userData = await res.json();

          setUser({
            ...userData,
            dob: new Date(userData.dob).toLocaleDateString(),
            createdAt: new Date(userData.createdAt).toLocaleDateString(),
          });
        } else {
          console.error('Failed to fetch user');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        //router.replace('/login');   // fallback on fetch fail
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${servers[2]}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const profile = await res.json();
        setStreak(profile.streak ?? 0);
      } catch (err) {
        console.error('Error fetching streak:', err);
      }
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      if (interval !== null) clearInterval(interval);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    const mins = parseInt(initialMinutes, 10);
    const newTotalTime = isNaN(mins) ? 0 : mins * 60;
    setTotalTime(newTotalTime);
    setTimeRemaining(newTotalTime);
    setTimerProgress(0);
    setIsRunning(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (totalTime > 0) {
      const progress = ((totalTime - timeRemaining) / totalTime) * 100;
      setTimerProgress(progress);
    } else {
      setTimerProgress(0);
    }
  }, [timeRemaining, totalTime]);

  // --- Exercise Data Fetching Placeholder ---
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${servers[2]}/api/exercises/user-daily-exercises?date=${format(currentDate, 'yyyy-MM-dd')}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch exercises');

        const data = await res.json();
        //console.log(data)
        setExercisesForDay(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExercises();
  }, [currentDate]);
  // --- End Exercise Data Fetching Placeholder ---

  const handleStartPause = async () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
  
    if (newRunningState) {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${servers[2]}/api/profile/update-streak`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (res.ok) {
          const data = await res.json();
          setStreak(data.streak); // update UI with new streak
        } else {
          console.warn('Failed to update streak');
        }
      } catch (err) {
        console.error('Error updating streak:', err);
      }
    }
  };
  


  // Date navigator handlers
  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  // Format date for display, show "TODAY" if it's today
  const formattedDate = format(currentDate, 'dd MMM');
  const displayDate = isToday(currentDate) ? 'TODAY, ' + formattedDate.toUpperCase() : format(currentDate, 'EEEE, dd MMM').toUpperCase();

  // Handlers for adding/editing exercises
  const handleAddExercise = () => {
    setSelectedExercise(null); // Clear any previously selected exercise
    setTempExerciseName('');
    setTempSets('3'); // Default sets
    setTempReps('10'); // Default reps
    setAddExerciseModalVisible(true); // Open the add exercise modal
  };
  const handleEditExercise = (exercise: Exercise) => {
    //console.log('Selected for edit:', selectedExercise);
    setSelectedExercise(exercise); // Set the exercise being edited
    setTempExerciseName(exercise.name);
    setTempSets(exercise.sets.toString());
    setTempReps(exercise.reps.toString());
    setAddExerciseModalVisible(true); // Open the add/edit modal
    setTempCategory(exercise.category || 'Legs');
    
  };
  const handleDeleteExercise = async (idToDelete: string) => {
    const updatedExercises = exercisesForDay.filter(ex => ex.id !== idToDelete);
    setExercisesForDay(updatedExercises);
  
    try {
      const token = await getAccessToken();
      await fetch(`${servers[2]}/api/exercises/user-daily-exercises`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: format(currentDate, 'yyyy-MM-dd'),
          exercises: updatedExercises.map(e => ({
            exercise_id: e.id,
            sets: e.sets,
            reps: e.reps,
            notes: e.notes || '',
            isCustom: e.isCustom || false,
            name: e.name,
            category: e.category || '',
          }))
        })
      });
    } catch (err) {
      console.error('Error deleting exercise:', err);
    }
  };
  const handleSaveExerciseWrapper = async (exercise: Exercise) => {
    const updated = [...exercisesForDay];
    const index = updated.findIndex(e => e.id === exercise.id);
  
    if (index > -1) {
      updated[index] = exercise;
    } else {
      updated.push(exercise);
    }
  
    // Save to API
    try {
      const token = await getAccessToken();
      await fetch(`${servers[2]}/api/exercises/user-daily-exercises`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: format(currentDate, 'yyyy-MM-dd'),
          exercises: updated.map(e => ({
            exercise_id: e.id,
            sets: e.sets,
            reps: e.reps,
            notes: e.notes || '',
            isCustom: e.isCustom,
            name: e.name,
            category: e.category || '',
          })),
        }),
      });
  
      setExercisesForDay(updated);
    } catch (err) {
      console.error('Failed to save exercise:', err);
    }
  };
  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#55F358', '#5aff91']}
        locations={[0.1, 0.3, 0.9]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>SLATE</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => setAccountVisible(true)}>
          {/* Always use the default Cloudinary image */}
          <Image
            source={{ uri: defaultProfileImageUrl }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <EditableStatBox
            label="CALORIE"
            value={calories}
            title="How many calories did you consume today?"
            placeholder="e.g. 2200"
            keyboardType="number-pad"
            onConfirmValue={(val) => setCalories(val)}
          />

          <WorkoutTimer
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            isRunning={isRunning}
            onStartPause={handleStartPause}
            onTimeChange={(newMinutes) => setInitialMinutes(newMinutes.toString())}
          />

          <View style={styles.statBox}>
            <Text style={styles.statValueSmall}>{streak !== null ? streak : '--'}</Text>
            <Text style={styles.statLabelSmall}>DAYS</Text>
          </View>
        </View>
      </LinearGradient>

      <CategorySummary exercises={exercisesForDay} />

      <DateNavigator
        onPrev={goToPreviousDay}
        onNext={goToNextDay}
        displayDate={displayDate}
      />

      <ScrollView style={styles.exerciseListContainer}
        contentContainerStyle={[
          styles.exerciseListContent,
          { paddingBottom: accountVisible ? screenHeight * 0.3 : 0 } // Adjust padding when modal is visible
        ]}
      >
        {exercisesForDay.length === 0 ? (
          <View style={styles.restContainer}>
            <Text style={styles.restTitle}>Rest & Recover </Text>
            <Text style={styles.restSubtitle}>No exercises scheduled for today.</Text>
          </View>
        ) : (
          exercisesForDay.map(exercise => (
            <ExerciseItem key={exercise.id} exercise={exercise} onEdit={handleEditExercise} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <AntDesign name="plus" size={screenWidth * 0.07} color="white" />
      </TouchableOpacity>


      {/*Other Modals */}
      <ExerciseModal
        visible={addExerciseModalVisible}
        onClose={() => setAddExerciseModalVisible(false)}
        initialExercise={selectedExercise as Exercise}
        onSave={(exercise) => handleSaveExerciseWrapper(exercise)}
        onDelete={handleDeleteExercise}
      />

      {!loadingUser && user && (
        <AccountModal
          visible={accountVisible}
          onClose={() => setAccountVisible(false)}
          user={user}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE9',
  },

  // Header Styles
  header: {
    height: screenHeight * 0.48, // Reduced header height (adjust as needed)
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'flex-start', // Align content to the top of the header
    alignItems: 'center',
    paddingTop: screenHeight * 0.06, // Reduced padding top
    paddingHorizontal: screenWidth * 0.05, // Keep horizontal padding
  },
  headerTitle: {
    fontSize: screenWidth * 0.1, // Relative font size for title (adjust as needed)
    color: 'white',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.03, // Adjusted margin bottom
  },

  // Adjusted profileButton and profileImage for relative sizing
  profileButton: {
    position: 'absolute',
   
    top: screenHeight * 0.05, // Adjusted to be relative to screen height
    right: screenWidth * 0.05, // Adjusted to be relative to screen width
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: (screenWidth * 0.15) / 2, // Make it circular (half of width/height)
    overflow: 'hidden', // Clip image to the border radius
    zIndex: 10,
    width: screenWidth * 0.13, // Relative width
    height: screenWidth * 0.13, // Relative height, making it a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%', // Take full width of the parent TouchableOpacity
    height: '100%', // Take full height of the parent TouchableOpacity
    borderRadius: (screenWidth * 0.15) / 2, // Half of width/height for perfect circle
    backgroundColor: '#D9F7D9', // Placeholder background
  },
  profileButtonText: {
    fontSize: 18,
  },

  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statValueSmall: {
    fontSize: screenWidth * 0.055,
    color: 'white',
    fontWeight: '400',
  },
  statLabelSmall: {
    fontSize: screenWidth * 0.035,
    color: 'white',
    marginTop: 4,
  },


  // Exercise List Styles
  exerciseListContainer: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.04,
    paddingTop: screenHeight * 0.005,
    backgroundColor: '#F2EDE9',
  },
  exerciseListContent: {
    paddingBottom: screenHeight * 0.05,
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.05,
    paddingHorizontal: screenWidth * 0.1,
  },
  restTitle: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: screenHeight * 0.01,
  },
  restSubtitle: {
    fontSize: screenWidth * 0.04,
    color: '#666',
    textAlign: 'center',
  },

  // Floating Add Button Style
  addButton: {
    position: 'absolute',
    bottom: screenHeight * 0.02,
    right: screenWidth * 0.05,
    backgroundColor: '#55F358',
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: screenWidth * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

});