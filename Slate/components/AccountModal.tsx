import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import { deleteTokens } from '@/utils/token';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    isGoogleAuth: boolean;
    dob: string;
    createdAt: string;
    plan?: string;
  };
};

const AccountModal = ({ visible, onClose, user }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    if(user.isGoogleAuth)GoogleSignin.signOut(); // signOut google
    // clear data
    await deleteTokens();
    onClose(); //will close modal
    router.replace('/(auth)/login')
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    
      <Modal
        isVisible={visible}
        onBackdropPress={handleClose}
        onSwipeComplete={handleClose}
        swipeDirection="down"
        animationInTiming={300}
        animationOutTiming={300}
        backdropOpacity={0.2}  
        backdropTransitionInTiming={1000} 

        
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.grabber} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>My Account</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Plan</Text>
            <Text style={styles.value}>{user.plan ?? 'Free'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Joined</Text>
            <Text style={styles.value}>{user.createdAt}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F2EDE9',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    maxHeight: screenHeight * 0.7, // Prevent modal from covering entire screen
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15, // space between grabber and title row
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  infoBox: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountModal;

/*
  <View style={styles.infoBox}>
    <Text style={styles.label}>Date of Birth</Text>
    <Text style={styles.value}>{user.dob}</Text>
  </View>
*/