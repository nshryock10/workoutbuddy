import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';

interface Movement {
  id: number;
  name: string;
  description: string;
  category: string;
  video_file?: string;
  muscle_groups?: string[];
}

interface MovementCardProps {
  movement: Movement;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  getYouTubeVideoId: (url?: string) => string | null;
  getYouTubeThumbnail: (videoId: string) => string;
}

const MovementCard: React.FC<MovementCardProps> = ({
  movement,
  isExpanded,
  onToggleExpand,
  getYouTubeVideoId,
  getYouTubeThumbnail,
}) => {
  const videoId = getYouTubeVideoId(movement.video_file);

  return (
    <TouchableOpacity
      style={styles.movementCard}
      onPress={() => onToggleExpand(movement.id)}
    >
      {videoId && !isExpanded ? (
        <View style={styles.unexpandedContainer}>
          <Image
            source={{ uri: getYouTubeThumbnail(videoId) }}
            style={styles.videoThumbnail}
            resizeMode="stretch"
          />
          <View style={styles.textContainer}>
            <Text style={styles.movementName}>{movement.name}</Text>
            <Text
              style={styles.movementDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {movement.description}
            </Text>
            <Text style={styles.movementCategory}>Category: {movement.category}</Text>
            {movement.muscle_groups && (
              <Text style={styles.movementMuscles}>
                Muscles: {movement.muscle_groups.join(', ')}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.movementName}>{movement.name}</Text>
          <Text
            style={styles.movementDescription}
            numberOfLines={isExpanded ? undefined : 1}
            ellipsizeMode="tail"
          >
            {movement.description}
          </Text>
          <Text style={styles.movementCategory}>Category: {movement.category}</Text>
          {movement.muscle_groups && (
            <Text style={styles.movementMuscles}>
              Muscles: {movement.muscle_groups.join(', ')}
            </Text>
          )}
          {videoId && isExpanded && (
            <YoutubePlayer
              height={200}
              videoId={videoId}
              play={isExpanded}
              initialPlayerParams={{ modestbranding: true }}
            />
          )}
        </>
      )}
      <Icon
        name={isExpanded ? 'expand-less' : 'expand-more'}
        size={SIZES.medium}
        color={COLORS.primary}
        style={styles.expandIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  movementCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    ...SHADOWS.small,
  },
  unexpandedContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 0,
    margin: 0,
  },
  videoThumbnail: {
    width: 160,
    height: '100%',
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 0,
  },
  movementName: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  movementDescription: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  movementCategory: {
    fontSize: SIZES.small,
    fontFamily: FONT.regular,
    color: COLORS.tertiary,
    marginTop: SIZES.small,
  },
  movementMuscles: {
    fontSize: SIZES.small,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  expandIcon: {
    alignSelf: 'flex-end',
    marginTop: SIZES.small,
  },
});

export default MovementCard;