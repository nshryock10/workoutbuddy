import React from 'react';
import { TextInput, StyleProp, TextStyle } from 'react-native';

export interface FormInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  style?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>; 
}

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  style,
  textStyle
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      style={[style, textStyle]}
    />
  );
};

export default FormInput;