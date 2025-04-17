import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import { User } from './src/navigation/types';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  const checkLoginAndOnboardingStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const storedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
    console.log('Initial check - Token:', token, 'UserData:', userData, 'Stored Onboarding:', storedOnboarding);

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: parsedUser.email, password: '' }), // Should use token in production
        });
        const data = await response.json();
        console.log('Backend login response:', data);
        if (response.ok) {
          setUser({ ...data.user, token: data.token });
          setHasCompletedOnboarding(data.user.hasCompletedOnboarding);
          await AsyncStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('hasCompletedOnboarding', String(data.user.hasCompletedOnboarding));
        } else {
          console.warn('Login sync failed, using local data');
          setHasCompletedOnboarding(parsedUser.hasCompletedOnboarding || false);
        }
      } catch (error) {
        console.error('Backend sync error:', error);
        setHasCompletedOnboarding(parsedUser.hasCompletedOnboarding || false);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setHasCompletedOnboarding(true); // Default to true when no user, skips onboarding
    }
  }, []);

  useEffect(() => {
    checkLoginAndOnboardingStatus();
  }, [checkLoginAndOnboardingStatus]);

  const handleLogin = async (userData: User) => {
    console.log('Login user data:', userData);
    setIsLoggedIn(true);
    setUser(userData);
    setHasCompletedOnboarding(userData.hasCompletedOnboarding || false);
    await AsyncStorage.setItem('token', userData.token || '');
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('hasCompletedOnboarding', String(userData.hasCompletedOnboarding || false));
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    setHasCompletedOnboarding(true); // Set to true to skip loading and show AuthNavigator
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('After logout - AsyncStorage hasCompletedOnboarding:', await AsyncStorage.getItem('hasCompletedOnboarding'));
    // Keep hasCompletedOnboarding in AsyncStorage for next login
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/api/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...data.user, token: user.token };
        setUser(updatedUser);
        setHasCompletedOnboarding(true);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    }
  };

  if (hasCompletedOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthNavigator onLogin={handleLogin} />
      ) : !hasCompletedOnboarding ? (
        <OnboardingNavigator onComplete={handleOnboardingComplete} user={user!} />
      ) : (
        <AppNavigator user={user} onLogout={handleLogout} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
  },
  loadingText: {
    fontSize: 20,
    color: '#312651',
  },
});

export default App;