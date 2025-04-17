import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { AuthNavigatorProps } from './types';

const Stack = createStackNavigator();

const AuthNavigator = ({ onLogin }: AuthNavigatorProps) => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" options={{ headerShown: false }}>
        {props => <SignInScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;