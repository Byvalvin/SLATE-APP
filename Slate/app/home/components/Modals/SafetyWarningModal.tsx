import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface SafetyWarningModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const SafetyWarningModal: React.FC<SafetyWarningModalProps> = ({ visible, onDismiss }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>⚠️ Exercise Safely</Text>
          <Text style={styles.subtitle}>
            Please perform exercises with proper form. Incorrect form can lead to injury.
            SLATE is here to guide you — but you're responsible for your own safety.
          </Text>
          <TouchableOpacity onPress={onDismiss} style={styles.button}>
            <Text style={styles.buttonText}>GOT IT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SafetyWarningModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: screenWidth * 0.8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#55F358',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
