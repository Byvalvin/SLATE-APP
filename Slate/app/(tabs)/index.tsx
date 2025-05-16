import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions, LogBox } from 'react-native'; // Import Dimensions
import { LinearGradient } from 'expo-linear-gradient';

import AccountModal from '../../components/AccountModal';
import { servers } from '@/constants/API';
import { getAccessToken } from '@/utils/token';


LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component.']);//temproary to be fixed later

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

export default function HomeScreen() {
  const [calories] = useState('2600');
  const [days] = useState('7');
  const [initialMinutes, setInitialMinutes] = useState('5');
  const [totalTime, setTotalTime] = useState(300);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(initialMinutes);

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
        if (!token) return;
  
        const res = await fetch(`${servers[1]}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
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

  const getTimerColor = () => {
    return '#58F975'; // forest green
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleEdit = () => setModalVisible(true);
  const confirmEdit = () => {
    setInitialMinutes(tempMinutes);
    setModalVisible(false);
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
              <View style={[styles.timerCircle, { borderRadius: timerBorderRadius, borderColor: 'rgba(255, 255, 255, 0.8)' }]}> {/* Use 80% opacity white */}
                <View style={[styles.timerFill, { backgroundColor: getTimerColor(), height: `${timerProgress}%` }]} />
                <Text style={styles.statValueMinutes}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.statLabelMinutes}>MINS</Text>
              </View>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}>
                <Text style={styles.controlButtonText}>{isRunning ? 'PAUSE' : 'START'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleEdit}>
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
            <TouchableOpacity style={styles.modalButton} onPress={confirmEdit}>
              <Text style={styles.modalButtonText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* show if user wants to see account */}
      {user && (
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
    height: '55%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: screenHeight * 0.08, // Make padding top relative to screen height
  },
  headerTitle: {
    fontSize: 40, // Font sizes are typically fixed, consider scaling libraries for more advanced needs
    color: 'white',
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.04, // Adjusted margin bottom slightly
  },

  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: screenWidth * 0.05, // Make horizontal padding relative
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
    flex: 2, // This allows the timer area to take up more space horizontally
  },
  statValueSmall: {
    fontSize: screenWidth * 0.055, // Increased font size (approx 20% larger than 0.045)
    color: 'white',
    fontWeight: '400',
  },
  statLabelSmall: {
    fontSize: screenWidth * 0.035, // Increased font size (approx 20% larger than 0.03)
    color: 'white',
    marginTop: 4, // Small fixed margins are often acceptable
  },

  // Timer Styles
  timerContainer: {
    // width, height, and borderRadius are set dynamically in the component
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01, // Reduced margin bottom to bring controls up
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Solid white background for the area inside the border
  },
  timerCircle: {
    position: 'relative',
    width: '100%', // Takes 100% of the dynamically sized timerContainer
    height: '100%', // Takes 100% of the dynamically sized timerContainer
    // borderRadius is set dynamically in the component
    borderWidth: 3, // Fixed border width - consider scaling this for very different screen sizes
    borderColor: 'rgba(255, 255, 255, 0.8)', // 80% opaque white border
    backgroundColor: 'transparent', // Make the background transparent
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure children are clipped
    // Removed marginTop: 45 as vertical centering is handled by parent flex
  },
  timerFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#55F358', // Matches your background color
  },
  statValueMinutes: {
    fontSize: screenWidth * 0.08, // Adjusted slightly to fit smaller circle, can tune this
    color: 'white',
    fontWeight: 'bold',
    zIndex: 1,
  },
  statLabelMinutes: {
    fontSize: screenWidth * 0.035, // Adjusted slightly to fit smaller circle, can tune this
    color: 'white',
    marginTop: 4,
    zIndex: 1,
  },
  timerControls: {
    flexDirection: 'row',
    marginTop: screenHeight * 0.01, // Reduced margin top to bring controls up
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: screenHeight * 0.01, // Make padding relative
    paddingHorizontal: screenWidth * 0.04, // Make padding relative
    borderRadius: 20, // Fixed border radius
    marginHorizontal: screenWidth * 0.01, // Make margin relative
  },
  controlButtonText: {
    fontSize: 16, // Fixed font size
    color: 'white',
    fontWeight: 'bold',
  },

  // Category Selector Styles
  categorySelector: {
    backgroundColor: 'white',
    marginHorizontal: screenWidth * 0.05, // Make horizontal margin relative
    marginTop: -screenHeight * 0.04, // Make negative margin relative
    borderRadius: 12, // Fixed border radius
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: screenHeight * 0.015, // Make vertical padding relative
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  categoryText: {
    fontWeight: '600',
    color: '#999',
    fontSize: screenWidth * 0.035, // Make font size relative
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F2EDE9',
    padding: screenWidth * 0.05, // Make padding relative
    borderRadius: 12, // Fixed border radius
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: screenWidth * 0.045, // Make font size relative
    marginBottom: screenHeight * 0.02, // Make margin bottom relative
    textAlign: 'center',
    fontWeight: 300,
    color: '#000',
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Fixed border radius
    padding: screenWidth * 0.035, // Make padding relative
    fontSize: 18, // Fixed font size
    width: '100%',
    marginBottom: screenHeight * 0.02, // Make margin bottom relative
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    color: '#000',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#55F358',
    borderRadius: 12, // Fixed border radius
    paddingVertical: screenHeight * 0.013, // Make padding relative
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16, // Fixed font size
    fontWeight: 'bold',
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
  
});