import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { COLORS, FONT, SIZES } from '@assets/constants/theme';

export interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'outline';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onPress, width, style, variant = 'primary' }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'secondary':
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, getButtonStyle(), { width: width || '100%' }, style]}
      onPress={onPress}
    >
      <Text style={[styles.baseText, getTextStyle()]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  baseText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default PrimaryButton;