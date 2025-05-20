import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@assets/constants/theme';
import { MovementsScreenNavigationProp } from '../navigation/types';
import MovementCard from '../components/MovementCard';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import SearchBar from '../components/SearchBar';
import FilterSortButtons from '../components/FilterSortButtons';

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

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilterSortButtons
        onShowFilterModal={() => setShowFilterModal(true)}
        onShowSortModal={() => setShowSortModal(true)}
        getFilterDisplayText={getFilterDisplayText}
        sortBy={sortBy}
      />
      <FlatList
        data={filteredMovements}
        renderItem={({ item }) => (
          <MovementCard
            movement={item}
            isExpanded={expandedMovements.has(item.id)}
            onToggleExpand={toggleExpand}
            getYouTubeVideoId={getYouTubeVideoId}
            getYouTubeThumbnail={getYouTubeThumbnail}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        allCategories={allCategories}
        allMuscles={allMuscles}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterMuscle={filterMuscle}
        setFilterMuscle={setFilterMuscle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
  },
  listContainer: {
    paddingBottom: SIZES.large,
  },
});

export default MovementsScreen;