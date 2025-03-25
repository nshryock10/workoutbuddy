import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import OnboardingCompleteScreen from '../screens/OnboardingCompleteScreen';
import { OnboardingNavigatorProps } from '../navigation/types';

const Stack = createStackNavigator();

const OnboardingNavigator = ({ onComplete, user }: OnboardingNavigatorProps) => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="OnboardingComplete">
        {props => <OnboardingCompleteScreen {...props} onComplete={onComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;