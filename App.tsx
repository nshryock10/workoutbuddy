import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AuthNavigator from './assets/src/navigation/AuthNavigator';

const App = () => {

  const [fontsLoaded] = useFonts({
    DMRegular: require('./assets/fonts/Manrope-Regular.ttf'),
    DMMedium: require('./assets/fonts/Manrope-Medium.ttf'),
    DMBold: require('./assets/fonts/Manrope-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;