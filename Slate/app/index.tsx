import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F2EDE9" barStyle="dark-content" />
      <Text style={styles.logo}>SLATE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#333',
  },
});
