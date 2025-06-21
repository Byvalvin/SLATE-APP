// Slate/app/legal-screen.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';

export default function LegalScreen() {
  const [tos, setTos] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>('tos');
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    const loadMarkdown = async () => {
      const tosAsset = Asset.fromModule(require('../assets/legal/tos.md'));
      const privacyAsset = Asset.fromModule(require('../assets/legal/privacy.md'));

      await tosAsset.downloadAsync();
      await privacyAsset.downloadAsync();

      const tosContent = await FileSystem.readAsStringAsync(tosAsset.localUri || '');
      const privacyContent = await FileSystem.readAsStringAsync(privacyAsset.localUri || '');

      setTos(tosContent);
      setPrivacy(privacyContent);
    };

    loadMarkdown();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [activeTab]);

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
    <View style={styles.outerContainer}>
      <View style={styles.stickyHeader}>
        <Text style={styles.stickyTitle}>
          {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </Text>
        <Text style={styles.stickyDate}>Effective Date: June 20, 2025</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'tos' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('tos')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'tos' && styles.activeTabText,
              ]}
            >
              Terms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'privacy' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('privacy')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'privacy' && styles.activeTabText,
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Markdown style={markdownStyles}>
          {activeTab === 'privacy' ? privacy : tos}
        </Markdown>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptText}>Accept & Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: '#F2EDE9',
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 60,
      paddingTop: 20,
      backgroundColor: '#F2EDE9',
    },
    stickyHeader: {
      backgroundColor: '#F2EDE9',
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      zIndex: 10,
    },
    stickyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#111',
    },
    stickyDate: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    tabRow: {
      flexDirection: 'row',
      marginTop: 16,
      justifyContent: 'center',
      gap: 10,
    },
    tabButton: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: '#e0e0e0',
    },
    activeTab: {
      backgroundColor: '#21BA3B',
    },
    tabText: {
      color: '#444',
      fontWeight: '500',
      fontSize: 14,
    },
    activeTabText: {
      color: '#fff',
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

  
  const markdownStyles: StyleSheet.NamedStyles<any> = {
    body: {
      fontSize: 16,
      lineHeight: 26,
      color: '#222',
    },
    heading1: {
      fontSize: 26,
      fontWeight: '700',
      marginTop: 30,
      marginBottom: 12,
    },
    heading2: {
      fontSize: 22,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 10,
    },
    heading3: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 8,
    },
    strong: {
      fontWeight: '700',
      color: '#000',
    },
    link: {
      color: '#21BA3B',
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    bullet_list: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 10,
    },
    list_item: {
      marginVertical: 4,
    },
    list_item_content: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    paragraph: {
      marginBottom: 14,
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginVertical: 16,
    },
  };
  