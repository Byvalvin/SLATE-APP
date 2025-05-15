// Slate/app/register.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { servers } from '../../constants/API';
import { saveTokens } from '@/utils/token';
import { useRouter } from 'expo-router';


export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !dob) {
      alert('Please fill all fields');
      return;
    }

    const user = {
      name,
      email,
      password,
      dob: dob.toISOString().split('T')[0],
    };

    try {
      const response = await fetch(`${servers[1]}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        await saveTokens(data.accessToken, data.refreshToken); // 💾 save session
        //router.replace('/onboarding'); // or tabs/home/etc
        alert('Registration successful!');
      } else {
        alert(`Error: ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to connect to server.');
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDob(selectedDate);
    hideDatePicker();
  };

  const isFormFilled = name.trim() && email.trim() && password.trim() && dob;
  const buttonBackground = isFormFilled ? '#55F358' : '#E9E2DA';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Let’s get you started</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#888"
          style={styles.inputBox}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.inputBox}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.inputBox} onPress={showDatePicker}>
          <Text style={{ color: dob ? '#000' : '#888', fontSize: 16 }}>
            {dob ? dob.toLocaleDateString() : 'Date of Birth'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
          date={dob || new Date(2000, 0, 1)}
        />

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>or register with</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <AntDesign name="google" size={32} color="#DB4437" />
        </TouchableOpacity>

        <Pressable onPress={handleRegister}>
          <View style={[styles.registerButton, { backgroundColor: buttonBackground }]}>
            <Text style={styles.registerButtonText}>REGISTER</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2EDE9',
    justifyContent: 'center',
    padding: 24,
  },
  innerContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#000',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  registerButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
