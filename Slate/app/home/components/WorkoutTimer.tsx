import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate timer size dynamically based on screen width - Reduced by 20% (from 0.5 to 0.4)
const timerSize = screenWidth * 0.4;
const timerBorderRadius = timerSize / 2;

interface WorkoutTimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  onStartPause: () => void;
  onTimeChange: (newMinutes: number) => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  timeRemaining,
  totalTime,
  isRunning,
  onStartPause,
  onTimeChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempMinutes, setTempMinutes] = useState((totalTime / 60).toString());

  const timerProgress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const confirmEdit = () => {
    const mins = parseInt(tempMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onTimeChange(mins);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.statBoxMiddle}>
      <View style={[styles.timerContainer, { width: timerSize, height: timerSize, borderRadius: timerBorderRadius }]}>
        <View style={[styles.timerCircle, { borderRadius: timerBorderRadius }]}>
          <View style={[styles.timerFill, { height: `${timerProgress}%` }]} />
          <Text style={styles.statValueMinutes}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.statLabelMinutes}>MINS</Text>
        </View>
      </View>

      <View style={styles.timerControls}>
        <TouchableOpacity style={styles.controlButton} onPress={onStartPause}>
          <Text style={styles.controlButtonText}>{isRunning ? 'PAUSE' : 'START'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.controlButtonText}>EDIT</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How long do you want your workout to be?</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={tempMinutes}
              onChangeText={setTempMinutes}
              placeholder="Minutes"
            />
            <TouchableOpacity style={styles.modalButton} onPress={confirmEdit}>
              <Text style={styles.modalButtonText}>CONFIRM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutTimer;

const styles = StyleSheet.create({
  statBoxMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.01,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // Black with 25% opacity
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.2,
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
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily:'Poppins-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // Black with 25% opacity
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.1,
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
    fontWeight: '300',
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
    marginTop: screenHeight * 0.01,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#999',
  },
});
