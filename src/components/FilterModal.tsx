import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  allCategories: string[];
  allMuscles: string[];
  filterCategory: string | null;
  setFilterCategory: (value: string | null) => void;
  filterMuscle: string | null;
  setFilterMuscle: (value: string | null) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  allCategories,
  allMuscles,
  filterCategory,
  setFilterCategory,
  filterMuscle,
  setFilterMuscle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter By</Text>
          <Text style={styles.filterLabel}>Category</Text>
          <Picker
            selectedValue={filterCategory}
            onValueChange={(value) => {
              console.log('Category Picker Value:', value);
              setFilterCategory(value === null || value === 'null' ? null : value as string);
            }}
            style={styles.picker}
          >
            <Picker.Item label="All" value={null} />
            {allCategories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
          <Text style={styles.filterLabel}>Muscle Group</Text>
          <Picker
            selectedValue={filterMuscle}
            onValueChange={(value) => {
              console.log('Muscle Picker Value:', value);
              setFilterMuscle(value === null || value === 'null' ? null : value as string);
            }}
            style={styles.picker}
          >
            <Picker.Item label="All" value={null} />
            {allMuscles.map((muscle) => (
              <Picker.Item key={muscle} label={muscle} value={muscle} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
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
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  picker: {
    width: '100%',
    color: COLORS.gray,
  },
  closeButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.white,
  },
});

export default FilterModal;