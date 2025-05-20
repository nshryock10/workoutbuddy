import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import PrimaryButton from './PrimaryButton';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, title, children }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {title && (
            <Text style={styles.modalTitle}>{title}</Text>
          )}
          {children}
          <PrimaryButton text="Close" onPress={onClose} variant="secondary" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
});

export default InfoModal;