import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { EquipmentOption } from '../navigation/types';

interface EquipmentOptionListProps {
  equipment: EquipmentOption[];
  selectedIds: number[];
  onSelect: (questionId: number, answerId: number, responseType: 'multiple') => void;
  questionId: number;
}

const EquipmentOptionList: React.FC<EquipmentOptionListProps> = ({
  equipment,
  selectedIds,
  onSelect,
  questionId,
}) => {
  const groupedEquipment = equipment.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {} as { [key: string]: EquipmentOption[] });

  return (
    <ScrollView style={styles.scrollContainer}>
      {Object.entries(groupedEquipment).map(([category, items]) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {items.map((eq) => (
            <TouchableOpacity
              key={eq.id}
              style={styles.option}
              onPress={() => onSelect(questionId, eq.id, 'multiple')}
            >
              <Icon
                name={selectedIds.includes(eq.id) ? 'check-box' : 'check-box-outline-blank'}
                size={SIZES.medium}
                color={COLORS.primary}
              />
              <Text style={styles.optionText}>{eq.option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: '85%',
    width: '100%',
  },
  categorySection: {
    width: '100%',
    marginBottom: SIZES.medium,
  },
  categoryTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.tertiary,
    marginBottom: SIZES.small,
  },
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

export default EquipmentOptionList;