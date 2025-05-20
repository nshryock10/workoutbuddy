export interface MovementSuggestion {
  id: number;
  name: string;
}

export interface WorkoutProgram {
  id: number;
  program_name: string;
  description: string;
  is_workout_of_day: boolean;
  public: boolean;
  user_id: number;
}

export const searchMovements = async (query: string): Promise<MovementSuggestion[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`http://localhost:3000/api/movements/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: MovementSuggestion[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movements:', error);
    return [];
  }
};

export const fetchWorkoutPrograms = async (user_id: number, is_workout_of_day?: boolean): Promise<WorkoutProgram[]> => {
  try {
    const query = new URLSearchParams({ user_id: user_id.toString() });
    if (is_workout_of_day) {
      query.append('is_workout_of_day', 'true');
    }
    const response = await fetch(`http://localhost:3000/api/workout_programs?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: WorkoutProgram[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workout programs:', error);
    return [];
  }
};