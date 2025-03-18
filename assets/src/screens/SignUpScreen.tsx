import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { SignUpScreenNavigationProp } from '../navigation/types';

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen = ({ navigation } : SignUpScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created! Please sign in.');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', data.message || 'Sign-up failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.gray}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        color={COLORS.secondary}
        onPress={handleSignUp}
      />
      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
        Already have an account? Sign In
      </Text>
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
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.large,
  },
  input: {
    width: '80%',
    padding: SIZES.medium / 2,
    marginBottom: SIZES.large,
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    ...SHADOWS.small,
  },
  link: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginTop: SIZES.large,
  },
  button: {
    backgroundColor: COLORS.tertiary
  }
});

export default SignUpScreen;