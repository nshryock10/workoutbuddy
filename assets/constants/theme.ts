export const COLORS = {
    primary: '#312651',
    secondary: '#444262',
    tertiary: '#FF7754',
    gray: '#83829A',
    lightWhite: '#FAFAFC',
    white: '#FFFFFF',
  };
  
  export const FONT = {
    regular: 'DMRegular',
    medium: 'DMMedium',
    bold: 'DMBold',
  };
  
  export const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
  };
  
  export const SHADOWS = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
    },
  };
  
  // New Button Styles
  export const BUTTONS = {
    primary: {
      backgroundColor: COLORS.tertiary,
      paddingVertical: SIZES.small,
      paddingHorizontal: SIZES.medium,
      borderRadius: SIZES.small,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    primaryText: {
      color: COLORS.white,
      fontSize: SIZES.medium,
      fontFamily: FONT.medium,
    },
    secondary: {
      borderWidth: 2,
      borderColor: COLORS.tertiary,
      paddingVertical: SIZES.small - 2, // Adjust for border
      paddingHorizontal: SIZES.medium,
      borderRadius: SIZES.small,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    secondaryText: {
      color: COLORS.tertiary,
      fontSize: SIZES.medium,
      fontFamily: FONT.medium,
    },
  };