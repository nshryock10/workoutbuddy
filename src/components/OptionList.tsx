import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { Option } from '../navigation/types';

interface OptionListProps {
  options: Option[];
  selectedIds: number[];
  onSelect: (questionId: number, answerId: number, responseType: 'single' | 'multiple') => void;
  responseType: 'single' | 'multiple';
  questionId: number;
}

const OptionList: React.FC<OptionListProps> = ({ options, selectedIds, onSelect, responseType, questionId }) => {
  return (
    <>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={styles.option}
          onPress={() => onSelect(questionId, opt.id, responseType)}
        >
          <Icon
            name={
              responseType === 'single'
                ? selectedIds.includes(opt.id)
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
                : selectedIds.includes(opt.id)
                ? 'check-box'
                : 'check-box-outline-blank'
            }
            size={SIZES.medium}
            color={COLORS.primary}
          />
          <Text style={styles.optionText}>{opt.option}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    width: '100%',
    ...SHADOWS.small,
  },
  optionText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },
});

export default OptionList;