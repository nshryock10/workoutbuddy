import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '@assets/constants/theme';

interface ProgressBarProps {
  progress: Animated.Value;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.small,
    overflow: 'hidden',
    marginBottom: SIZES.medium,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.small,
  },
});

export default ProgressBar;