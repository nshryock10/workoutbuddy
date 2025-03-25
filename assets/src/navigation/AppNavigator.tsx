import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, FONT, SIZES, SHADOWS, BUTTONS } from '@assets/constants/theme';
import { AppNavigatorProps } from './types';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const calculateAge = (birthday?: string): number | null => {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const ProfileMenu = ({ user, onLogout }: AppNavigatorProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.8))[0];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible, slideAnim]);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <>
      <TouchableOpacity style={styles.profileIconContainer} onPress={toggleMenu}>
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>
      {menuVisible && (
        <Animated.View
          style={[
            styles.overlayContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.background} onPress={toggleMenu} />
          <SafeAreaView style={styles.menuContainer} edges={['left', 'right']}>
            <TouchableOpacity style={styles.closeIconContainer} onPress={toggleMenu}>
              <Text style={styles.closeIcon}>✖</Text>
            </TouchableOpacity>
            <View style={styles.profileContent}>
              <Text style={styles.username}>{user?.username || 'User'}</Text>
              <Text style={styles.name}>
                {user?.firstName || ''} {user?.lastName || ''}
              </Text>
              <Text style={styles.details}>
                {user?.sex || 'Not specified'}, {calculateAge(user?.birthday) ?? 'N/A'}
              </Text>
              <TouchableOpacity style={[BUTTONS.primary, styles.logoutButton]} onPress={onLogout}>
                <Text style={BUTTONS.primaryText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
    </>
  );
};

const AppNavigator = ({ user, onLogout }: AppNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerLeft: () => <ProfileMenu user={user} onLogout={onLogout} />,
        headerRight: () => null,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profileIconContainer: {
    marginLeft: SIZES.medium,
  },
  profileIcon: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
  },
  menuContainer: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: COLORS.white,
    zIndex: 1002,
  },
  closeIconContainer: {
    position: 'absolute',
    top: SIZES.medium,
    right: SIZES.medium,
    zIndex: 1003,
  },
  closeIcon: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  profileContent: {
    padding: SIZES.large,
    alignItems: 'flex-start',
    flex: 1,
  },
  username: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.small,
    textAlign: 'left',
  },
  name: {
    fontSize: SIZES.large,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.small,
    textAlign: 'left',
  },
  details: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.large,
    textAlign: 'left',
  },
  logoutButton: {
    width: '85%',
    alignSelf: 'center',
  },
});

export default AppNavigator;