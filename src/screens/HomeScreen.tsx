import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '@assets/constants/theme';

const HomeScreen = () => {
  const fetchServerMessage = async () => {
    try {
      const response = await fetch('http://localhost:3000/api');
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error fetching server message:', error);
      alert('Failed to connect to the server. Is it running?');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitnessTracker!</Text>
      <Text style={styles.subtitle}>Plan, Track, and Compete</Text>
      <Button
        title="Get Started"
        color={COLORS.primary}
        onPress={fetchServerMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.large / 2,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
});

export default HomeScreen;