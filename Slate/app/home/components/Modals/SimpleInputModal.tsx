import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  Dimensions,
} from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SimpleInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
  onChangeText: (text: string) => void;
  title: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  confirmLabel?: string;
  cancelLabel?: string;
}

const SimpleInputModal: React.FC<SimpleInputModalProps> = ({
  visible,
  onClose,
  onConfirm,
  value,
  onChangeText,
  title,
  placeholder = '',
  keyboardType = 'default',
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.modalInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
          <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
            <Text style={styles.modalButtonText}>{confirmLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalCancelButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleInputModal;

const styles = StyleSheet.create({
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
        marginTop: screenHeight * 0.01,
      },
});
