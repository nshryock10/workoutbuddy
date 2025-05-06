import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, SHADOWS } from '@assets/constants/theme';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onBack, onNext }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-back" size={SIZES.large} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Icon name="arrow-forward" size={SIZES.large} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  nextButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    ...SHADOWS.small,
  },
  backButton: {
    backgroundColor: COLORS.gray,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    ...SHADOWS.small,
  },
});

export default NavigationButtons;