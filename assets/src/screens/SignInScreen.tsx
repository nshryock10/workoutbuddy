import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { SignInScreenNavigationProp } from '../navigation/types';

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen = ({ navigation } : SignInScreenProps) => {
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
        Alert.alert('Success', 'Signed in successfully!');
        navigation.navigate('Home');
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
        title="Sign In"
        color={COLORS.primary}
        onPress={handleSignIn}
      />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don’t have an account? Sign Up
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
});

export default SignInScreen;