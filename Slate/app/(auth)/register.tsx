import React, { useState } from 'react';
import { 
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Dimensions, // Import Dimensions
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { servers } from '../../constants/API';
import { saveTokens } from '@/utils/token';
import { useRouter } from 'expo-router';

import * as Google from 'expo-auth-session/providers/google'; // Google OAuth
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GauthProvider, useGauth } from './context/G-authContext';

WebBrowser.maybeCompleteAuthSession();


const clientId = Constants.expoConfig?.extra?.googleClientId;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {user, isLoading, signIn} = useGauth();

  const router = useRouter();


  const handleRegister = async () => {
    if (!name || !email || !password /*|| !dob*/) {
      alert('Please fill all fields');
      return;
    }

    const user = {
      name,
      email,
      password,
      //dob: dob.toISOString().split('T')[0],
    };

    try {
      const response = await fetch(`${servers[2]}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        await saveTokens(data.accessToken, data.refreshToken); // 💾 save session
        // router.replace('/onboarding'); // or tabs/home/etc - Decide your post-registration navigation
        alert('Registration successful!'); // You might want to navigate instead of alerting
        router.push('/onboarding/height_weight'); // first onboard qurstion
        
      } else {
        alert(`Error: ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to connect to server.');
    }
  };


  const isFormFilled = name.trim() && email.trim() && password.trim() /*&& dob*/;
  const buttonBackground = isFormFilled ? '#55F358' : '#E9E2DA';

  return (
    <GauthProvider>
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
              autoCapitalize="words" // Capitalize names
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.inputBox}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.inputBox}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.separatorContainer}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>or register with</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={signIn} >
              <AntDesign name="google" size={screenWidth * 0.08} color="#DB4437" />
            </TouchableOpacity>

            <Pressable onPress={handleRegister}>
              <View style={[styles.registerButton, { backgroundColor: buttonBackground }]}>
                <Text style={styles.registerButtonText}>REGISTER</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
    </GauthProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2EDE9',
    justifyContent: 'center',
    padding: screenWidth * 0.06, // Relative padding
  },
  innerContainer: {
    // Adjust marginTop if needed based on desired spacing from top
    // marginTop: screenHeight * 0.05,
  },
  title: {
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#333',
    textAlign: 'center',
    marginBottom: screenHeight * 0.006, // Relative margin bottom
  },
  subtitle: {
    fontSize: screenWidth * 0.05, // Relative font size
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: screenHeight * 0.020, // Relative margin bottom
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: screenWidth * 0.03, // Relative border radius
    paddingVertical: screenHeight * 0.014, // Relative vertical padding
    paddingHorizontal: screenWidth * 0.035, // Relative horizontal padding
    fontSize: screenWidth * 0.035, // Relative font size
    marginBottom: screenHeight * 0.012, // Relative margin bottom
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4, // Fixed shadow radius
    elevation: 2, // Fixed elevation
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: screenHeight * 0.012, // Relative vertical margin
  },
  line: {
    flex: 1,
    height: 1, // Fixed height
    backgroundColor: '#000',
  },
  separatorText: {
    marginHorizontal: screenWidth * 0.025, // Relative horizontal margin
    color: '#000',
    fontSize: screenWidth * 0.035, // Relative font size
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: screenWidth * 0.03, // Relative border radius
    paddingVertical: screenHeight * 0.012, // Relative vertical padding
    alignItems: 'center',
    marginBottom: screenHeight * 0.020, // Relative margin bottom
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4, // Fixed shadow radius
    elevation: 2, // Fixed elevation
  },
  registerButton: { // Renamed from loginButton for clarity
    borderRadius: screenWidth * 0.03, // Relative border radius
    paddingVertical: screenHeight * 0.012, // Relative vertical padding
    alignItems: 'center',
  },
  registerButtonText: { // Renamed from loginButtonText for clarity
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#fff',
    fontWeight: 'bold',
  },
});
