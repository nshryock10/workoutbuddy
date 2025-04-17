import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@assets/constants/theme';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovementsScreen from '../screens/MovementsScreen'; // We'll create this
import { AppNavigatorProps, AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppNavigator = ({ user, onLogout }: AppNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Movements') iconName = 'fitness-center';
          return <Icon name={iconName!} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerRight: () => (
        <Icon name="logout" size={24} color={COLORS.primary} style={{ marginRight: 15 }} onPress={onLogout} />
      )}} />
      <Tab.Screen name="Movements" component={MovementsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;