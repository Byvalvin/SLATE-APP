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
import { useRouter } from 'expo-router';
import { server } from '../../constants/API';
import { saveTokens } from '@/utils/token';
import { hasProfile } from '@/utils/profile';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmittingGauthRequest, setIsSubmittingGauthRequest] = useState(false);

  const router = useRouter();


  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsSubmittingGauthRequest(true);

      // Sign out any active Google session first, so user can alway pick account
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;

        const loginPayload = { googleUserToken: idToken };
        const res = await fetch(`${server}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginPayload),
        });

        const data = await res.json();
        if (res.ok) {
          await saveTokens(data.accessToken, data.refreshToken);
          const profileExists = await hasProfile();
          if (profileExists) {
            router.replace('/(tabs)');
          } else {
            router.push('/onboarding/height_weight');
          }
        } else {
          alert(data.message || 'Login failed');
        }
      }
      setIsSubmittingGauthRequest(false);
    } catch (error) {
      setIsSubmittingGauthRequest(false);
      if (isErrorWithCode(error)) {
        const { SIGN_IN_CANCELLED, IN_PROGRESS, PLAY_SERVICES_NOT_AVAILABLE } = statusCodes;

        switch (error.code) {
          case SIGN_IN_CANCELLED:
            alert('Google Sign-In was cancelled.');
            break;
          case IN_PROGRESS:
            alert('Google Sign-In already in progress.');
            break;
          case PLAY_SERVICES_NOT_AVAILABLE:
            alert('Play Services unavailable.');
            break;
          default:
            alert('Unknown Google Sign-In error.');
        }
      } else {
        console.error('Google login error:', error);
        alert('Login failed.');
      }
    }
  };


  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      const response = await fetch(`${server}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //console.log(data);

      if (response.ok) {
        await saveTokens(data.accessToken, data.refreshToken); // store session
        
        const profileExists = await hasProfile();
        if (profileExists) {
          router.replace('/(tabs)');
        } else {
          router.push('/onboarding/height_weight');
        }
        
      } else {
        alert(`Error: ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to server.');
    }
  };

  const isFormFilled = email.trim() !== '' && password.trim() !== '';
  const buttonBackground = isFormFilled ? '#55F358' : '#E9E2DA';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

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
          <Text style={styles.separatorText}>or continue with</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={isSubmittingGauthRequest}>
          <AntDesign name="google" size={screenWidth * 0.08} color="#DB4437" />
        </TouchableOpacity>

        <Pressable onPress={handleLogin}>
          <View style={[styles.loginButton, { backgroundColor: buttonBackground }]}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
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
    padding: screenWidth * 0.06, // Make padding relative to screen width
  },
  innerContainer: {
    // You might want this to be relative or based on design needs
    // marginTop: screenHeight * 0.05, // Example: Relative margin top
  },
  title: {
    fontSize: screenWidth * 0.04, // Make font size relative to screen width
    color: '#333',
    textAlign: 'center',
    marginBottom: screenHeight * 0.006, // Make margin bottom relative
  },
  subtitle: {
    fontSize: screenWidth * 0.05, // Make font size relative
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: screenHeight * 0.020, // Make margin bottom relative
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: screenWidth * 0.03, // Make border radius relative
    padding: screenHeight * 0.012, // Make padding relative (vertical focus)
    fontSize: screenWidth * 0.035, // Make font size relative
    marginBottom: screenHeight * 0.020, // Make margin bottom relative
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4, // Fixed shadow radius often looks okay
    elevation: 2, // Fixed elevation often looks okay
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: screenHeight * 0.012, // Make vertical margin relative
  },
  line: {
    flex: 1,
    height: 1, // Fixed height for the line is fine
    backgroundColor: '#000',
  },
  separatorText: {
    marginHorizontal: screenWidth * 0.025, // Make horizontal margin relative
    color: '#000',
    fontSize: screenWidth * 0.035, // Make font size relative
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: screenWidth * 0.03, // Make border radius relative
    paddingVertical: screenHeight * 0.012, // Make padding relative (vertical focus)
    alignItems: 'center',
    marginBottom: screenHeight * 0.020, // Make margin bottom relative
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4, // Fixed shadow radius
    elevation: 2, // Fixed elevation
  },
  loginButton: {
    borderRadius: screenWidth * 0.03, // Make border radius relative
    paddingVertical: screenHeight * 0.012, // Make padding relative (vertical focus)
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: screenWidth * 0.04, // Make font size relative
    color: '#fff',
    fontWeight: 'bold',
  },
});