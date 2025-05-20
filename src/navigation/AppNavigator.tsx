import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES } from '@assets/constants/theme';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovementsScreen from '../screens/MovementsScreen';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';
import { AppNavigatorProps, AppTabParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<AppTabParamList>();

const PlaceholderScreen = () => null;

const AppNavigator = ({ user, onLogout }: AppNavigatorProps) => {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Movements') iconName = 'fitness-center';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'CreateWorkout') {
            return (
              <View style={styles.createButton}>
                <Icon name="add" size={size} color={COLORS.white} />
              </View>
            );
          }
          else return null;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarShowLabel: route.name !== 'CreateWorkout' && route.name !== 'Placeholder',
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
        headerRight: () => (
          <Icon
            name="person"
            size={SIZES.large}
            color={COLORS.primary}
            style={{ marginRight: SIZES.medium }}
            onPress={() => navigation.navigate('Profile')}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <Icon
              name="logout"
              size={SIZES.large}
              color={COLORS.primary}
              style={{ marginRight: SIZES.medium }}
              onPress={onLogout}
            />
          ),
        }}
      />
      <Tab.Screen name="Movements" component={MovementsScreen} />
      <Tab.Screen
        name="CreateWorkout"
        component={CreateWorkoutScreen}
        options={{
          tabBarLabel: '',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: SIZES.medium }}
              onPress={() => {
                // Placeholder for hasChanges check; ideally passed as prop
                Alert.alert(
                  'Confirm Exit',
                  'You have unsaved changes. Are you sure you want to exit?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', onPress: () => navigation.goBack() },
                  ]
                );
              }}
            >
              <Icon name="close" size={SIZES.large} color={COLORS.gray} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Placeholder"
        component={PlaceholderScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.large,
    width: SIZES.large * 1.5,
    height: SIZES.large * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;