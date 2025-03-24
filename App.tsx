import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './assets/src/navigation/AuthNavigator';
import AppNavigator from './assets/src/navigation/AppNavigator';
import { User } from './assets/src/navigation/types'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkLoginStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    setIsLoggedIn(!!token);
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleLogin = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigator user={user} onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
};

export default App;