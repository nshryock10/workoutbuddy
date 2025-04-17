import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { MovementsScreenNavigationProp } from '../navigation/types';

interface Movement {
  id: number;
  name: string;
  description: string;
  category: string;
  video_file?: string;
  muscle_groups?: string[];
}

interface MovementsScreenProps {
  navigation: MovementsScreenNavigationProp;
}

const MovementsScreen = ({ navigation }: MovementsScreenProps) => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'muscle' | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterMuscle, setFilterMuscle] = useState<string | null>(null);
  const [expandedMovements, setExpandedMovements] = useState<Set<number>>(new Set());
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movements');
      const data: Movement[] = await response.json();
      setMovements(data);
      console.log('Fetched Movements Length:', data.length);
    } catch (error) {
      console.error('Error fetching movements:', error);
    }
  };

  const allCategories = Array.from(new Set(movements.map(m => m.category))).sort();
  const allMuscles = Array.from(new Set(movements.flatMap(m => m.muscle_groups || []))).sort();

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch = movement.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === null ? true : movement.category === filterCategory;
    const matchesMuscle = filterMuscle === null ? true : (movement.muscle_groups?.includes(filterMuscle) ?? false);
    const result = matchesSearch && matchesCategory && matchesMuscle;
    console.log(`Movement: ${movement.name}, Search: ${matchesSearch}, Category: ${matchesCategory} (filter: ${filterCategory}), Muscle: ${matchesMuscle} (filter: ${filterMuscle}), Result: ${result}`);
    return result;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'muscle') {
      const muscleA = (a.muscle_groups && a.muscle_groups[0]) || '';
      const muscleB = (b.muscle_groups && b.muscle_groups[0]) || '';
      return muscleA.localeCompare(muscleB);
    }
    return 0;
  });

  useEffect(() => {
    console.log('Filtered Movements Length:', filteredMovements.length);
    console.log('Current Filters - Category:', filterCategory, 'Muscle:', filterMuscle);
  }, [filteredMovements, filterCategory, filterMuscle]);

  const toggleExpand = (id: number) => {
    setExpandedMovements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
  };

  const getFilterDisplayText = () => {
    const hasCategoryFilter = filterCategory !== null && filterCategory !== undefined;
    const hasMuscleFilter = filterMuscle !== null && filterMuscle !== undefined;
    if (!hasCategoryFilter && !hasMuscleFilter) return 'All';
    if (hasCategoryFilter && hasMuscleFilter) return `${filterCategory}, ${filterMuscle}`;
    if (hasCategoryFilter) return filterCategory as string;
    if (hasMuscleFilter) return filterMuscle as string;
    return 'All';
  };

  const renderMovement = ({ item }: { item: Movement }) => {
    const isExpanded = expandedMovements.has(item.id);
    const videoId = getYouTubeVideoId(item.video_file);
    return (
      <TouchableOpacity
        style={styles.movementCard}
        onPress={() => toggleExpand(item.id)}
      >
        {videoId && !isExpanded ? (
          <View style={styles.unexpandedContainer}>
            <Image
              source={{ uri: getYouTubeThumbnail(videoId) }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.movementName}>{item.name}</Text>
              <Text
                style={styles.movementDescription}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
              <Text style={styles.movementCategory}>Category: {item.category}</Text>
              {item.muscle_groups && (
                <Text style={styles.movementMuscles}>Muscles: {item.muscle_groups.join(', ')}</Text>
              )}
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.movementName}>{item.name}</Text>
            <Text
              style={styles.movementDescription}
              numberOfLines={isExpanded ? undefined : 1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
            <Text style={styles.movementCategory}>Category: {item.category}</Text>
            {item.muscle_groups && (
              <Text style={styles.movementMuscles}>Muscles: {item.muscle_groups.join(', ')}</Text>
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movements..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterSortContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text>Filter: {getFilterDisplayText()}</Text>
          <Icon name="filter-list" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text>Sort by: {sortBy || 'None'}</Text>
          <Icon name="sort" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredMovements}
        renderItem={renderMovement}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <Picker
              selectedValue={sortBy}
              onValueChange={(value) => {
                setSortBy(value as 'name' | 'category' | 'muscle' | null);
                setShowSortModal(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="None" value={null} />
              <Picker.Item label="A to Z" value="name" />
              <Picker.Item label="Category" value="category" />
              <Picker.Item label="Muscle Group" value="muscle" />
            </Picker>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter By</Text>
            <Text style={styles.filterLabel}>Category</Text>
            <Picker
              selectedValue={filterCategory}
              onValueChange={(value) => {
                console.log('Category Picker Value:', value);
                setFilterCategory(value === null || value === 'null' ? null : value as string);
              }}
              style={styles.picker}
            >
              <Picker.Item label="All" value={null} />
              {allCategories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
            <Text style={styles.filterLabel}>Muscle Group</Text>
            <Picker
              selectedValue={filterMuscle}
              onValueChange={(value) => {
                console.log('Muscle Picker Value:', value);
                setFilterMuscle(value === null || value === 'null' ? null : value as string);
              }}
              style={styles.picker}
            >
              <Picker.Item label="All" value={null} />
              {allMuscles.map((muscle) => (
                <Picker.Item key={muscle} label={muscle} value={muscle} />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.small,
    marginBottom: SIZES.medium,
  },
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
  listContainer: {
    paddingBottom: SIZES.large,
  },
  movementCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    ...SHADOWS.small,
  },
  unexpandedContainer: {
    flexDirection: 'row',
    alignItems: 'stretch', // Ensure children stretch to container height
    minHeight: 100, // Minimum height for consistent layout
    padding: 0,
    
  },
  videoThumbnail: {
    width: 100, // Adjusted for 16:9 aspect ratio
    minHeight: 100,
    height: '100%', // Span full container height
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  picker: {
    width: '100%',
    color: COLORS.gray,
  },
  closeButton: {
    marginTop: SIZES.medium,
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.white,
  },
});

export default MovementsScreen;