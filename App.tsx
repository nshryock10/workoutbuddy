import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './assets/src/navigation/AuthNavigator';
import AppNavigator from './assets/src/navigation/AppNavigator';
import OnboardingNavigator from './assets/src/navigation/OnboardingNavigator';
import { User } from './assets/src/navigation/types';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  const checkLoginAndOnboardingStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const localOnboardingComplete = await AsyncStorage.getItem('hasCompletedOnboarding');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: parsedUser.email, password: '' }), // Use token auth in production
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setHasCompletedOnboarding(data.user.hasCompletedOnboarding);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          await AsyncStorage.setItem('hasCompletedOnboarding', String(data.user.hasCompletedOnboarding));
        } else {
          setHasCompletedOnboarding(localOnboardingComplete === 'true');
        }
      } catch (error) {
        console.error('Backend sync error:', error);
        setHasCompletedOnboarding(localOnboardingComplete === 'true');
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setHasCompletedOnboarding(true);
    }
  }, []);

  useEffect(() => {
    checkLoginAndOnboardingStatus();
  }, [checkLoginAndOnboardingStatus]);

  const handleLogin = async (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    setHasCompletedOnboarding(userData.hasCompletedOnboarding || false);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('hasCompletedOnboarding', String(userData.hasCompletedOnboarding || false));
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
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
        setUser(data.user);
        setHasCompletedOnboarding(true);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    }
  };

  if (hasCompletedOnboarding === null) {
    return <View><Text>Loading...</Text></View>;
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

export default App;