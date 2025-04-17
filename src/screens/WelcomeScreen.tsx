import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES, BUTTONS } from '@assets/constants/theme';
import { WelcomeScreenNavigationProp } from '../navigation/types';

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitnessTracker!</Text>
      <Text style={styles.subtitle}>Let’s get you started with a quick setup.</Text>
      <TouchableOpacity style={BUTTONS.primary} onPress={() => navigation.navigate('UserInfo')}>
        <Text style={BUTTONS.primaryText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.large,
  },
  subtitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xLarge,
    textAlign: 'center',
  },
});

export default WelcomeScreen;