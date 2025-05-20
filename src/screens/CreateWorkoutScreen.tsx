import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { CreateWorkoutScreenNavigationProp } from '../navigation/types';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import MovementInput from '../components/MovementInput';
import NumberInputWithButtons from '../components/NumberInputWithButtons';
import { generateWorkoutId } from '../utils/uuid';

interface Set {
  id: string;
  reps: number;
}

interface Movement {
  id: string;
  name: string;
  movement_id: number | null;
  sets: Set[];
  equipment_id: number | null;
  notes: string;
}

interface CreateWorkoutScreenProps {
  navigation: CreateWorkoutScreenNavigationProp;
}

const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [movements, setMovements] = useState<Movement[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const user_id = 1; // Placeholder; get from auth

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Confirm Exit',
        'You have unsaved changes. Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const addMovement = () => {
    const newMovement: Movement = {
      id: Date.now().toString(),
      name: '',
      movement_id: null,
      sets: [{ id: Date.now().toString() + '-1', reps: 1 }],
      equipment_id: null,
      notes: '',
    };
    setMovements([...movements, newMovement]);
    setHasChanges(true);
  };

  const updateMovement = (id: string, updates: Partial<Movement>) => {
    setMovements(
      movements.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    setHasChanges(true);
  };

  const addSet = (movementId: string) => {
    setMovements(
      movements.map((m) =>
        m.id === movementId
          ? { ...m, sets: [...m.sets, { id: Date.now().toString(), reps: 1 }] }
          : m
      )
    );
    setHasChanges(true);
  };

  const updateSet = (movementId: string, setId: string, reps: number) => {
    setMovements(
      movements.map((m) =>
        m.id === movementId
          ? {
              ...m,
              sets: m.sets.map((s) => (s.id === setId ? { ...s, reps } : s)),
            }
          : m
      )
    );
    setHasChanges(true);
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Workout name is required');
      return;
    }
    if (movements.length === 0) {
      Alert.alert('Error', 'At least one movement is required');
      return;
    }
    try {
      const workout_id = generateWorkoutId();
      const response = await fetch('http://localhost:3000/api/planned_workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id,
          program_id: null,
          movements: movements.flatMap((m) =>
            m.sets.map((s, index) => ({
              description: m.name,
              block_id: null,
              movement_id: m.movement_id,
              planned_set: index + 1,
              planned_reps: s.reps,
              equipment_id: m.equipment_id,
              planned_rest: null,
              notes: m.notes,
              user_id,
            }))
          ),
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Workout saved!');
        setHasChanges(false);
        navigation.goBack();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  const renderMovement = ({ item }: { item: Movement }) => (
    <View style={styles.movementContainer}>
      <MovementInput
        value={item.name}
        onChange={(updates) => updateMovement(item.id, updates)}
        placeholder="Movement name"
        style={styles.movementInput}
      />
      <Text style={styles.setsHeader}>Reps/Sets</Text>
      <View style={styles.setsContainer}>
        {item.sets.map((set, index) => (
          <NumberInputWithButtons
            key={set.id}
            value={set.reps}
            onChange={(reps) => updateSet(item.id, set.id, reps)}
            placeholder={`Set ${index + 1}`}
            style={styles.squareInput}
          />
        ))}
        <TouchableOpacity
          style={styles.addSetButton}
          onPress={() => addSet(item.id)}
        >
          <Icon name="add" size={SIZES.medium} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      <FormInput
        value={item.notes}
        onChangeText={(text) => updateMovement(item.id, { notes: text })}
        placeholder="Notes"
        style={styles.notesInput}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FormInput
        value={workoutName}
        onChangeText={(text) => {
          setWorkoutName(text);
          setHasChanges(true);
        }}
        placeholder="Workout Name / Description"
        style={styles.nameInput}
      />
      <FlatList
        data={movements}
        renderItem={renderMovement}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={addMovement}>
            <Icon name="add" size={SIZES.large} color={COLORS.gray} />
          </TouchableOpacity>
        }
      />
      <View style={styles.saveButtonContainer}>
        <PrimaryButton text="Save Workout" onPress={saveWorkout} width="80%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
  },
  nameInput: {
    marginBottom: SIZES.large,
  },
  movementContainer: {
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.lightWhite || '#F5F5F5',
    padding: SIZES.medium,
    borderRadius: SIZES.small,
  },
  movementInput: {
    marginBottom: SIZES.small,
  },
  setsHeader: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.small,
  },
  squareInput: {
    width: 60,
    height: 60,
    textAlign: 'center',
    marginRight: SIZES.medium,
    marginBottom: SIZES.small,
  },
  addSetButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  notesInput: {
    marginTop: SIZES.small,
  },
  addButton: {
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
});

export default CreateWorkoutScreen;