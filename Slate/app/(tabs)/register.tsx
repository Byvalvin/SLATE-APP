// Slate/app/register.tsx
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');

  const handleRegister = () => {
    // TODO: connect to backend API
    console.log({ name, email, dob });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Let’s get to know you better!</Text>
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
          placeholder="Date of Birth (YYYY-MM-DD)"
          placeholderTextColor="#888"
          style={styles.inputBox}
          value={dob}
          onChangeText={setDob}
        />

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Register with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
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
  googleButtonText: {
    color: '#000',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#E9E2DA',
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