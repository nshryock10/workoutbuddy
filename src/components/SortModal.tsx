import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: 'name' | 'category' | 'muscle' | null;
  setSortBy: (value: 'name' | 'category' | 'muscle' | null) => void;
}

const SortModal: React.FC<SortModalProps> = ({ visible, onClose, sortBy, setSortBy }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={(value) => {
              setSortBy(value as 'name' | 'category' | 'muscle' | null);
              onClose();
            }}
            style={styles.picker}
          >
            <Picker.Item label="None" value={null} />
            <Picker.Item label="A to Z" value="name" />
            <Picker.Item label="Category" value="category" />
            <Picker.Item label="Muscle Group" value="muscle" />
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

export default SortModal;