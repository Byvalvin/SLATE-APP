// Slate/app/legal-screen.tsx

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

export default function LegalScreen() {
  const [tos, setTos] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const router = useRouter();

  const loadMarkdown = async () => {
    const tosUri = FileSystem.asset('assets/legal/tos.md').uri;
    const privacyUri = FileSystem.asset('assets/legal/privacy.md').uri;

    const [tosText, privacyText] = await Promise.all([
      FileSystem.readAsStringAsync(tosUri),
      FileSystem.readAsStringAsync(privacyUri),
    ]);

    setTos(tosText);
    setPrivacy(privacyText);
  };

  useEffect(() => {
    loadMarkdown();
  }, []);

  const handleAccept = () => {
    router.push('/register');
  };

  if (!tos || !privacy) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#21BA3B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Terms of Service</Text>
      <Markdown style={markdownStyles}>{tos}</Markdown>

      <TouchableOpacity onPress={() => setShowPrivacy(!showPrivacy)}>
        <Text style={styles.toggle}>
          {showPrivacy ? 'Hide Privacy Policy ▲' : 'Show Privacy Policy ▼'}
        </Text>
      </TouchableOpacity>

      {showPrivacy && (
        <>
          <Text style={styles.header}>Privacy Policy</Text>
          <Markdown style={markdownStyles}>{privacy}</Markdown>
        </>
      )}

      <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
        <Text style={styles.acceptText}>Accept & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#F2EDE9',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  toggle: {
    fontSize: 16,
    color: '#21BA3B',
    marginVertical: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  acceptButton: {
    backgroundColor: '#21BA3B',
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 20, color: '#333' },
};
