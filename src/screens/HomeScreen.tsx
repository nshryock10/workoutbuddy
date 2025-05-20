import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { COLORS, FONT, SIZES } from '@assets/constants/theme';
import { HomeScreenNavigationProp } from '../navigation/types';
import TitleText from '../components/TitleText';
import { fetchWorkoutPrograms, WorkoutProgram } from '../utils/api';
// import PrimaryButton from '../components/PrimaryButton'; // Uncomment if adding navigation buttons

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [workoutOfDay, setWorkoutOfDay] = useState<WorkoutProgram | null>(null);
  const user_id = 1; // Placeholder; get from auth context

  useEffect(() => {
    fetchWorkoutProgramsData();
  }, []);

  const fetchWorkoutProgramsData = async () => {
    try {
      const data = await fetchWorkoutPrograms(user_id, true);
      if (data.length > 0) {
        setWorkoutOfDay(data[0]);
      } else {
        setWorkoutOfDay(null);
      }
    } catch (error) {
      console.error('Error fetching workout programs:', error);
      // Only show alert for unexpected errors
      Alert.alert('Error', 'Failed to load workout programs. Please try again later.');
    }
  };

  const fetchServerMessage = async () => {
    try {
      const response = await fetch('http://localhost:3000/api');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      Alert.alert('Server', data.message);
    } catch (error) {
      console.error('Error fetching server message:', error);
      Alert.alert('Error', 'Failed to connect to the server. Is it running?');
    }
  };

  return (
    <View style={styles.container}>
      <TitleText text="Welcome to FitnessTracker!" fontSize={SIZES.xLarge} fontWeight={FONT.bold} />
      <Text style={styles.subtitle}>Plan, Track, and Compete</Text>
      {workoutOfDay ? (
        <View style={styles.workoutOfDay}>
          <Text style={styles.workoutTitle}>Workout of the Day: {workoutOfDay.program_name}</Text>
          <Text style={styles.workoutDescription}>{workoutOfDay.description || 'No description'}</Text>
        </View>
      ) : (
        <Text style={styles.noWorkoutText}>No workout of the day available</Text>
      )}
      <Button
        title="Get Started"
        color={COLORS.primary}
        onPress={fetchServerMessage}
      />
      {/* Optional navigation buttons; uncomment to enable
      <PrimaryButton
        text="View Movements"
        onPress={() => navigation.navigate('Movements')}
        width="80%"
      />
      <PrimaryButton
        text="Create Workout"
        onPress={() => navigation.navigate('CreateWorkout')}
        width="80%"
      />
      <PrimaryButton
        text="View Profile"
        onPress={() => navigation.navigate('Profile')}
        width="80%"
      />
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  workoutOfDay: {
    marginBottom: SIZES.large,
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  workoutDescription: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  noWorkoutText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
});

export default HomeScreen;