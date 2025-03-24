import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { AppNavigatorProps } from './types';

const Tab = createBottomTabNavigator();

const ProfileMenu = ({ user, onLogout }: AppNavigatorProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.profileIcon}>👤</Text> {/* Placeholder icon */}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.profileIconLarge}>👤</Text>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => { onLogout(); setModalVisible(false); }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AppNavigator = ({ user, onLogout }: AppNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <ProfileMenu user={user} onLogout={onLogout} />,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    marginRight: SIZES.medium,
  },
  profileIcon: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  profileIconLarge: {
    fontSize: SIZES.xxLarge,
    marginBottom: SIZES.medium,
  },
  username: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.large,
  },
  logoutButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
  closeButton: {
    padding: SIZES.small,
  },
  closeText: {
    color: COLORS.secondary,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
});

export default AppNavigator;