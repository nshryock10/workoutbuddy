import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES, BUTTONS } from '@assets/constants/theme';
import { OnboardingCompleteScreenNavigationProp } from '../navigation/types';

interface OnboardingCompleteScreenProps {
  navigation: OnboardingCompleteScreenNavigationProp;
  onComplete: () => void;
}

const OnboardingCompleteScreen = ({ onComplete }: OnboardingCompleteScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’re All Set!</Text>
      <Text style={styles.subtitle}>Ready to start your fitness journey?</Text>
      <TouchableOpacity style={BUTTONS.primary} onPress={onComplete}>
        <Text style={BUTTONS.primaryText}>Get Started</Text>
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

export default OnboardingCompleteScreen;