import { useRouter } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const welcomeImage = require('../assets/images/welcome_image.jpg');

export default function WelcomeScreen() {
     const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={welcomeImage} style={styles.welcomeBg}>
        <View style={styles.overlay}>
          <Text style={styles.title}>SLATE</Text>
          <Text style={styles.subtitle}>Get Personalized Advice</Text>
          <Text style={styles.body}>
            from your own personal AI trainer curated for you.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
                <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.footerText, styles.link]}> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 55,
    fontFamily: 'SourceSans3-Bold',
    marginBottom: 520,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#21BA3B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  link: {
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});
