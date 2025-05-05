import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, SHADOWS } from '@assets/constants/theme';

interface FilterSortButtonsProps {
  onShowFilterModal: () => void;
  onShowSortModal: () => void;
  getFilterDisplayText: () => string;
  sortBy: 'name' | 'category' | 'muscle' | null;
}

const FilterSortButtons: React.FC<FilterSortButtonsProps> = ({
  onShowFilterModal,
  onShowSortModal,
  getFilterDisplayText,
  sortBy,
}) => {
  return (
    <View style={styles.filterSortContainer}>
      <TouchableOpacity style={styles.filterButton} onPress={onShowFilterModal}>
        <Text>Filter: {getFilterDisplayText()}</Text>
        <Icon name="filter-list" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sortButton} onPress={onShowSortModal}>
        <Text>Sort by: {sortBy || 'None'}</Text>
        <Icon name="sort" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
});

export default FilterSortButtons;