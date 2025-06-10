import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { CreateWorkoutScreenNavigationProp } from '../navigation/types';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import MovementInput from '../components/MovementInput';
import { generateWorkoutId } from '../utils/uuid';

interface Set {
  id: string;
  reps: string;
  weight: string;
}

interface Movement {
  id: string;
  name: string;
  movement_id: number | null;
  sets: Set[];
  equipment_id: number | null;
  notes: string;
  sameRepsAndWeights: boolean;
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
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', onPress: () => navigation.goBack() },
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
      sets: [
        { id: Date.now().toString() + '-1', reps: '', weight: '' },
        { id: Date.now().toString() + '-2', reps: '', weight: '' },
        { id: Date.now().toString() + '-3', reps: '', weight: '' },
      ],
      equipment_id: null,
      notes: '',
      sameRepsAndWeights: false,
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
          ? {
              ...m,
              sets: [...m.sets, { id: Date.now().toString(), reps: '', weight: '' }],
            }
          : m
      )
    );
    setHasChanges(true);
  };

  const removeSet = (movementId: string) => {
    setMovements(
      movements.map((m) =>
        m.id === movementId && m.sets.length > 1
          ? { ...m, sets: m.sets.slice(0, -1) }
          : m
      )
    );
    setHasChanges(true);
  };

  const updateSet = (movementId: string, setId: string, updates: Partial<Set>) => {
    setMovements(
      movements.map((m) => {
        if (m.id !== movementId) return m;
        const updatedSets = m.sets.map((s) =>
          s.id === setId ? { ...s, ...updates } : s
        );
        if (m.sameRepsAndWeights && (updates.reps || updates.weight) && m.sets[0].id === setId) {
          const firstSet = updatedSets[0];
          return {
            ...m,
            sets: updatedSets.map((s) => ({
              ...s,
              reps: firstSet.reps || s.reps,
              weight: firstSet.weight || s.weight,
            })),
          };
        }
        return { ...m, sets: updatedSets };
      })
    );
    setHasChanges(true);
  };

  const toggleSameRepsAndWeights = (movementId: string) => {
    setMovements(
      movements.map((m) => {
        if (m.id !== movementId) return m;
        const newChecked = !m.sameRepsAndWeights;
        if (newChecked) {
          const firstSet = m.sets.find((s) => s.reps || s.weight) || m.sets[0];
          return {
            ...m,
            sameRepsAndWeights: newChecked,
            sets: m.sets.map((s) => ({
              ...s,
              reps: firstSet.reps || s.reps,
              weight: firstSet.weight || s.weight,
            })),
          };
        }
        return { ...m, sameRepsAndWeights: newChecked };
      })
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
    if (
      movements.some((m) =>
        m.sets.some((s) => !s.reps || isNaN(parseInt(s.reps)) || parseInt(s.reps) <= 0)
      )
    ) {
      Alert.alert('Error', 'All sets must have valid reps (positive numbers).');
      return;
    }
    if (
      movements.some((m) =>
        m.sets.some(
          (s) => s.weight && (isNaN(parseInt(s.weight)) || parseInt(s.weight) < 0)
        )
      )
    ) {
      Alert.alert('Error', 'Weights must be valid non-negative numbers.');
      return;
    }
    try {
      const workout_id = await generateWorkoutId(); // Updated to async
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
              planned_reps: parseInt(s.reps) || 0,
              equipment_id: m.equipment_id,
              planned_rest: null,
              notes: m.notes,
              user_id,
              planned_weight: s.weight ? parseInt(s.weight) : null,
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
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const renderMovement = ({ item }: { item: Movement }) => (
    <View style={styles.movementContainer}>
      <MovementInput
        value={item.name}
        onChange={(updates) => updateMovement(item.id, updates)}
        placeholder="Movement name"
        style={styles.movementInput}
        textStyle={styles.movementNameText}
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.customCheckbox,
            item.sameRepsAndWeights && styles.checkedCheckbox,
          ]}
          onPress={() => toggleSameRepsAndWeights(item.id)}
        >
          {item.sameRepsAndWeights && (
            <Icon name="check" size={SIZES.medium} color={COLORS.white} />
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Same reps and weights each set</Text>
      </View>
      <Text style={styles.setsHeader}>Sets: {item.sets.length}</Text>
      <View style={styles.setsContainer}>
        {item.sets.map((set, index) => (
          <View key={set.id} style={styles.setPair}>
            <TextInput
              value={set.reps}
              onChangeText={(text) => updateSet(item.id, set.id, { reps: text })}
              placeholder={`Set ${index + 1} Reps`}
              style={styles.repsInput}
              keyboardType="numeric"
            />
            <TextInput
              value={set.weight}
              onChangeText={(text) => updateSet(item.id, set.id, { weight: text })}
              placeholder="Weight (lbs)"
              style={styles.weightInput}
              keyboardType="numeric"
            />
          </View>
        ))}
        <View style={styles.setButtons}>
          <TouchableOpacity
            style={styles.addSetButton}
            onPress={() => addSet(item.id)}
          >
            <Icon name="add" size={SIZES.medium} color={COLORS.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addSetButton, item.sets.length <= 1 && styles.disabledButton]}
            onPress={() => removeSet(item.id)}
            disabled={item.sets.length <= 1}
          >
            <Icon name="remove" size={SIZES.medium} color={item.sets.length <= 1 ? COLORS.gray : COLORS.gray} />
          </TouchableOpacity>
        </View>
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
        textStyle={styles.workoutNameText}
      />
      <FlatList
        data={movements}
        renderItem={renderMovement}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={addMovement}>
            <Icon name="add" size={SIZES.xLarge || 28} color={COLORS.gray} /> {/* Increased size */}
          </TouchableOpacity>
        }
      />
      <View style={styles.saveButtonContainer}>
        <PrimaryButton
          text="Save Workout"
          onPress={saveWorkout}
          width="80%"
        />
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
  workoutNameText: {
    fontSize: RFValue(20, 580), // H3
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  movementContainer: {
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  movementInput: {
    marginBottom: SIZES.small,
  },
  movementNameText: {
    fontSize: RFValue(16, 580), // H4
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xSmall,
  },
  checkedCheckbox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
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
    alignItems: 'flex-start',
  },
  setPair: {
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  repsInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.xSmall,
    textAlign: 'center',
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    padding: SIZES.xSmall,
  },
  weightInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.xSmall,
    textAlign: 'center',
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    padding: SIZES.xSmall,
    marginTop: SIZES.xSmall,
  },
  setButtons: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  addSetButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.xSmall,
    marginHorizontal: SIZES.xSmall,
  },
  disabledButton: {
    opacity: 0.5,
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