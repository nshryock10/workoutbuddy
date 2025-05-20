import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '@assets/constants/theme';

interface TitleTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: string;
}

const TitleText: React.FC<TitleTextProps> = ({ text, fontSize = SIZES.large, fontWeight = FONT.medium }) => {
  return <Text style={[styles.text, { fontSize, fontFamily: fontWeight }]}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
});

export default TitleText;