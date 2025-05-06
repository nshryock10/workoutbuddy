import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '@assets/constants/theme';

interface QuestionDisplayProps {
  question: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return <Text style={styles.question}>{question}</Text>;
};

const styles = StyleSheet.create({
  question: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
});

export default QuestionDisplay;