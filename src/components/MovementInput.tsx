import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import FormInput, { FormInputProps } from './FormInput';
import { searchMovements } from '../utils/api';

export interface MovementSuggestion {
  id: number;
  name: string;
}

export interface MovementInputProps extends Omit<FormInputProps, 'onChangeText'> {
  onChange: (updates: { name: string; movement_id: number | null }) => void;
}

const MovementInput: React.FC<MovementInputProps> = ({
  value,
  onChange,
  placeholder,
  style,
  keyboardType,
}) => {
  const [suggestions, setSuggestions] = useState<MovementSuggestion[]>([]);

  const handleSearch = async (query: string) => {
    onChange({ name: query, movement_id: null });
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await searchMovements(query);
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching movements:', error);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: MovementSuggestion) => {
    onChange({ name: suggestion.name, movement_id: suggestion.id });
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <FormInput
        value={value}
        onChangeText={handleSearch}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={[styles.input, style]}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    marginBottom: SIZES.small,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
    zIndex: 10,
  },
  suggestionItem: {
    padding: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  suggestionText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
  },
});

export default MovementInput;