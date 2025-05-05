import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@assets/constants/theme';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Search movements..."
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.small,
    marginBottom: SIZES.medium,
  },
});

export default SearchBar;