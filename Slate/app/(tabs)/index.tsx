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
  Image, // Import the Image component
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; // Import icons for the date navigator and add button
import { format, addDays, subDays, isToday } from 'date-fns'; // Import date manipulation functions and isToday
import { getAccessToken } from '@/utils/token';
import { servers } from '@/constants/API';
import { fetchWithAuth } from '@/utils/user';
import AccountModal from '@/components/AccountModal';


// Temporarily suppress the specific warning during development
// REMOVE this line and the LogBox import once you fix the underlying issue
//LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component.']);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Placeholder for exercise data structure (you'll fetch this from your API)
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  imageKey: string; // Key to look up local image
}


export default function HomeScreen() {
  const [calories] = useState('2600');
  const [days] = useState('7');
  const [initialMinutes, setInitialMinutes] = useState('5');
  const [totalTime, setTotalTime] = useState(300);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Modal for timer edit
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false); // Modal for adding exercise
  const [tempMinutes, setTempMinutes] = useState(initialMinutes);
  const [currentDate, setCurrentDate] = useState(new Date()); // State for the date navigator

  const [exercisesForDay, setExercisesForDay] = useState<Exercise[]>([]);
  // State for adding/editing exercise details
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [tempSets, setTempSets] = useState('3');
  const [tempReps, setTempReps] = useState('10');
  const [tempExerciseName, setTempExerciseName] = useState(''); // For manual input or selection from list

  const [accountVisible, setAccountVisible] = useState(false);

  // Calculate timer size dynamically based on screen width - Reduced by 20% (from 0.5 to 0.4)
  const timerSize = screenWidth * 0.4;
  const timerBorderRadius = timerSize / 2;

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAccessToken();
        if (!token){
          console.log('No valid access token, redirecting to login');
          //router.replace('/login');  // or however you navigate
          return;
        }
        const res = await fetchWithAuth(`${servers[1]}/api/auth/me`);

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
        //router.replace('/login');  // fallback on fetch fail
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
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
  // In a real app, you would fetch exercises for the current date here
   useEffect(() => {
     const fetchExercises = async () => {
        // Fetch data from your API for the currentDate
        // const data = await api.get(`/exercises?date=${format(currentDate, 'yyyy-MM-dd')}`);
        // setExercisesForDay(data);
       console.log(`Workspaceing exercises for: ${format(currentDate, 'yyyy-MM-dd')}`);
        // Placeholder static data for now
        setExercisesForDay([
          { id: '1', name: 'SQUATS', sets: 3, reps: 10, imageKey: 'squats_img_1' },
          { id: '2', name: 'BENCH PRESS', sets: 3, reps: 10, imageKey: 'bench_press_img_a' },
          { id: '3', name: 'LATERAL RAISE', sets: 3, reps: 10, imageKey: 'lateral_raise_img' },
           { id: '4', name: 'BICEP CURL', sets: 3, reps: 10, imageKey: 'bicep_curl_img' },
        ]);
     };
     fetchExercises();
   }, [currentDate]); // Refetch when date changes
  // --- End Exercise Data Fetching Placeholder ---


  const getTimerColor = () => {
    return '#58F975'; // forest green
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleEditTimer = () => setModalVisible(true);
  const confirmEditTimer = () => {
    setInitialMinutes(tempMinutes);
    setModalVisible(false);
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
      setSelectedExercise(exercise); // Set the exercise being edited
      setTempExerciseName(exercise.name);
      setTempSets(exercise.sets.toString());
      setTempReps(exercise.reps.toString());
      setAddExerciseModalVisible(true); // Open the add/edit modal
  }

  const handleSaveExercise = () => {
      // TODO: Implement logic to save/update the exercise for the current date
      // This would involve:
      // 1. Getting the selected exercise ID (or name if manually entered)
      // 2. Getting the entered sets and reps
      // 3. Sending this data to your backend API for the specific currentDate
      // 4. Updating the exercisesForDay state locally after successful save

      console.log("Saving Exercise:", {
          id: selectedExercise?.id, // Will be null for new exercises
          name: tempExerciseName,
          sets: parseInt(tempSets, 10),
          reps: parseInt(tempReps, 10),
          date: format(currentDate, 'yyyy-MM-dd') // Associate with the current date
      });

      // Close the modal
      setAddExerciseModalVisible(false);
  };


  // Placeholder for local image mapping
  // Add your actual require paths here once images are in assets/images or a subfolder
  const exerciseImageMap: { [key: string]: any } = {
      'squats_img_1': null, // require('../assets/images/squat.png'),
      'bench_press_img_a': null, // require('../assets/images/bench_press.png'),
      'lateral_raise_img': null, // require('../assets/images/lateral_raise.png'),
      'bicep_curl_img': null, // require('../assets/images/bicep_curl.png'),
      // Add all your custom image requires here
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
          <Text style={styles.profileButtonText}>⚙️</Text>
        </TouchableOpacity>



        <View style={styles.statsContainer}>
          
          <View style={styles.statBox}>
            <Text style={styles.statValueSmall}>{calories}</Text>
            <Text style={styles.statLabelSmall}>CALORIE</Text>
          </View>
          
          <View style={styles.statBoxMiddle}>
            <View style={[styles.timerContainer, { width: timerSize, height: timerSize, borderRadius: timerBorderRadius }]}>
              <View style={[styles.timerCircle, { borderRadius: timerBorderRadius, borderColor: 'rgba(255, 255, 255, 0.8)' }]}> 
                <View style={[styles.timerFill, { backgroundColor: getTimerColor(), height: `${timerProgress}%` }]} />
                <Text style={styles.statValueMinutes}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.statLabelMinutes}>MINS</Text>
              </View>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}>
                <Text style={styles.controlButtonText}>{isRunning ? 'PAUSE' : 'START'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleEditTimer}>
                <Text style={styles.controlButtonText}>EDIT</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValueSmall}>{days}</Text>
            <Text style={styles.statLabelSmall}>DAYS</Text>
          </View>
        </View>
      </LinearGradient>

      
      <View style={styles.categorySelector}>
        <Text style={styles.categoryText}>LEG</Text>
        <Text style={styles.categoryText}>CHEST</Text>
        <Text style={styles.categoryText}>ARMS</Text>
      </View>

      
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={goToPreviousDay}>
          <AntDesign name="left" size={screenWidth * 0.05} color="#000" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{displayDate}</Text>
        <TouchableOpacity onPress={goToNextDay}>
          <AntDesign name="right" size={screenWidth * 0.05} color="#000" />
        </TouchableOpacity>
      </View>

      
      <ScrollView style={styles.exerciseListContainer} contentContainerStyle={styles.exerciseListContent}>
         
         
         {exercisesForDay.map(exercise => (
              <ExerciseItem key={exercise.id} exercise={exercise} onEdit={handleEditExercise} exerciseImageMap={exerciseImageMap} /> // Pass image map
         ))}
      </ScrollView>

      
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
         <AntDesign name="plus" size={screenWidth * 0.07} color="white" />
      </TouchableOpacity>


      
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How long do you want your workout to be?</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={tempMinutes}
              onChangeText={setTempMinutes}
            />
            <TouchableOpacity style={styles.modalButton} onPress={confirmEditTimer}>
              <Text style={styles.modalButtonText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
       <Modal visible={addExerciseModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{selectedExercise ? 'Edit Exercise' : 'Add Exercise'}</Text>

                    
                    
                    <TextInput
                        placeholder="Exercise Name"
                        style={styles.modalInput}
                        value={tempExerciseName}
                        onChangeText={setTempExerciseName}
                    />

                    
                    <TextInput
                        placeholder="Sets"
                        style={styles.modalInput}
                        keyboardType="number-pad"
                        value={tempSets}
                        onChangeText={setTempSets}
                    />
                     <TextInput
                        placeholder="Reps"
                        style={styles.modalInput}
                        keyboardType="number-pad"
                        value={tempReps}
                        onChangeText={setTempReps}
                    />

                    <TouchableOpacity style={styles.modalButton} onPress={handleSaveExercise}>
                        <Text style={styles.modalButtonText}>{selectedExercise ? 'SAVE CHANGES' : 'ADD EXERCISE'}</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setAddExerciseModalVisible(false)}>
                        <Text style={styles.modalButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </View>
       </Modal>
       
       <AccountModal
          visible={accountVisible}
          onClose={() => setAccountVisible(false)}
          user={user}
        />
    </View>
  );
}

// --- Separate Exercise Item Component (Recommended) ---
// Put this in a separate file like components/ExerciseItem.tsx
// and import it into HomeScreen.tsx.
// Keeping it here for now for ease of illustration.
// Remember to import Image and other necessary components if you move it.
const ExerciseItem = ({ exercise, onEdit, exerciseImageMap }: { exercise: Exercise, onEdit: (exercise: Exercise) => void, exerciseImageMap: { [key: string]: any } }) => {
    // The image map is now passed as a prop, so you don't need to define it here again
    // or import the individual images within this component if you move it.

    return (
        <TouchableOpacity style={styles.exerciseItem} onPress={() => onEdit(exercise)}> 
            
            
            {exercise.imageKey && exerciseImageMap && exerciseImageMap[exercise.imageKey] ? (
               <Image
                 source={exerciseImageMap[exercise.imageKey]}
                 style={styles.exerciseImagePlaceholder} // Reuse placeholder style for size
               />
             ) : (
               // Fallback Placeholder (shows the gray box when image is not found or path is commented out)
               <View style={styles.exerciseImagePlaceholder} />
             )}
            
            <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                <Text style={styles.exerciseReps}>{exercise.sets} SET - {exercise.reps} REP</Text>
            </View>
             
             
        </TouchableOpacity>
    );
};
// --- End Separate Exercise Item Component ---


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

  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },

  profileButtonText: {
    fontSize: 18,
  },


  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    // paddingHorizontal is now on the header itself
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statBoxMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
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

  // Timer Styles
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Solid white background for the area inside the border
   
  },
  timerCircle: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timerFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#55F358',
  },
  statValueMinutes: {
    fontSize: screenWidth * 0.08,
    color: 'white',
    fontWeight: 'bold',
    zIndex: 1,
  },
  statLabelMinutes: {
    fontSize: screenWidth * 0.035,
    color: 'white',
    marginTop: 4,
    zIndex: 1,
  },
  timerControls: {
    flexDirection: 'row',
    marginTop: screenHeight * 0.01,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.04,
    borderRadius: 20,
    marginHorizontal: screenWidth * 0.01,
  },
  controlButtonText: {
    fontSize: 16, // Fixed font size
    color: 'white',
    fontWeight: 'bold',
  },

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
  categoryText: {
    fontWeight: '600',
    color: '#999',
    fontSize: screenWidth * 0.035,
  },

  // Date Navigator Styles
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    backgroundColor: '#F2EDE9',
  },
  dateText: {
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
    color: '#000',
  },

  // Exercise List Styles
  exerciseListContainer: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.04,
    paddingTop: screenHeight * 0.005,
    backgroundColor: '#F2EDE9',
  },
   exerciseListContent: { // Added content container style
        paddingBottom: screenHeight * 0.05, // Add padding at the bottom to prevent FAB from hiding last item
   },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: screenWidth * 0.03,
    marginBottom: screenHeight * 0.01,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseImagePlaceholder: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    backgroundColor: '#E9E2DA',
    borderRadius: 8,
    marginRight: screenWidth * 0.04,
    // If using actual Image component, remove backgroundColor and borderRadius here
  },
  exerciseDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: '400',
    color: '#333',
    marginBottom: screenHeight * 0.005,
  },
  exerciseReps: {
    fontSize: screenWidth * 0.035,
    color: '#666',
  },

  // Floating Add Button Style
  addButton: {
    position: 'absolute', // Position absolutely
    bottom: screenHeight * 0.02, // Distance from bottom
    right: screenWidth * 0.05, // Distance from right
    backgroundColor: '#55F358', // Green background color
    width: screenWidth * 0.15, // Button size
    height: screenWidth * 0.15, // Button size (make it circular)
    borderRadius: screenWidth * 0.075, // Half of width/height for circle
    justifyContent: 'center', // Center icon
    alignItems: 'center', // Center icon
    shadowColor: '#000', // Add shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
   // Add button icon is styled inline in the JSX

  // Modal Styles (Timer Edit) - Keeping existing styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F2EDE9',
    padding: screenWidth * 0.05,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: screenWidth * 0.045,
    marginBottom: screenHeight * 0.02,
    textAlign: 'center',
    fontWeight: '300', // fontWeight should be a string like '300', '400', 'bold', 'normal'
    color: '#000',
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: screenWidth * 0.035,
    fontSize: screenWidth * 0.04,
    width: '100%',
    marginBottom: screenHeight * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    color: '#000',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#55F358',
    borderRadius: 12,
    paddingVertical: screenHeight * 0.013,
    width: '100%',
    alignItems: 'center',
     marginTop: screenHeight * 0.01, // Add space above button if needed
  },
  modalButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
  },
  modalCancelButton: { // Style for a cancel button in the modal
        backgroundColor: '#999', // Example: different color for cancel
        marginTop: screenHeight * 0.01,
  },
});