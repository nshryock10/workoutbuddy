import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT, SIZES, BUTTONS, SHADOWS } from '@assets/constants/theme';
import { UserInfoScreenNavigationProp } from '../navigation/types';

interface UserInfoScreenProps {
  navigation: UserInfoScreenNavigationProp;
}

const UserInfoScreen = ({ navigation }: UserInfoScreenProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');

  const handleNext = () => {
    if (!height || !weight || !goal) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    navigation.navigate('OnboardingComplete');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell Us About Yourself</Text>
      <TextInput
        style={styles.input}
        placeholder="Height (e.g., 170 cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (e.g., 70 kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fitness Goal (e.g., Lose Weight)"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity style={BUTTONS.primary} onPress={handleNext}>
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
  input: {
    width: '80%',
    padding: SIZES.small,
    marginBottom: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    ...SHADOWS.small,
  },
});

export default UserInfoScreen;