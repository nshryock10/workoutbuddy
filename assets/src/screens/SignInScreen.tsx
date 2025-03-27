import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS, BUTTONS } from '@assets/constants/theme';
import { SignInScreenNavigationProp, User } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
  onLogin: (userData: User) => void;
}

const SignInScreen = ({ navigation, onLogin }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        onLogin({ ...data.user, token: data.token });
        Alert.alert('Success', 'Signed in successfully!');
      } else {
        Alert.alert('Error', data.message || 'Sign-in failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={BUTTONS.primary} onPress={handleSignIn}>
        <Text style={BUTTONS.primaryText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.link}>
        Don’t have an account?{' '}
        <Text style={styles.linkHighlight} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
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
  link: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginTop: SIZES.large,
  },
  linkHighlight: {
    color: COLORS.tertiary,
    fontFamily: FONT.bold,
  },
});

export default SignInScreen;