import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES } from '@assets/constants/theme';
import FormInput from './FormInput';

interface NumberInputWithButtonsProps {
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  style?: StyleProp<TextStyle>;
}

const NumberInputWithButtons: React.FC<NumberInputWithButtonsProps> = ({
  value,
  onChange,
  placeholder,
  style,
}) => {
  const incrementValue = (delta: number) => {
    const newValue = Math.max(1, value + delta);
    onChange(newValue);
  };

  return (
    <View style={styles.inputGroup}>
      <FormInput
        value={value.toString()}
        onChangeText={(text) => onChange(parseInt(text) || 1)}
        placeholder={placeholder}
        keyboardType="numeric"
        style={[styles.squareInput, style]}
      />
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => incrementValue(1)}
          style={styles.arrowButton}
        >
          <Icon name="arrow-upward" size={SIZES.medium} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => incrementValue(-1)}
          style={styles.arrowButton}
        >
          <Icon name="arrow-downward" size={SIZES.medium} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  squareInput: {
    width: 60,
    height: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.xSmall,
  },
  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
  },
  arrowButton: {
    padding: SIZES.xSmall,
  },
});

export default NumberInputWithButtons;