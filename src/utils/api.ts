// Type definitions for API responses
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
}

// Search movements by query
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

// Fetch workout programs with optional filters
export const fetchWOD = async (is_workout_of_day?: boolean, is_public?: boolean): Promise<WorkoutProgram[]> => {
  try {
    const query = new URLSearchParams();
    //if (is_workout_of_day) query.append('is_workout_of_day', 'true');
    //if (is_public) query.append('public', 'true');
    const response = await fetch(`http://localhost:3000/api/wod`);
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

// User login
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token); // Store JWT token
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// User registration
export const register = async (userData: { 
  username: string; 
  email: string; 
  phone: string; 
  firstName: string; 
  lastName: string; 
  sex: string; 
  birthday: string; 
  password: string 
}) => {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Complete user onboarding
export const completeOnboarding = async (email: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/complete-onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error('Onboarding completion failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during onboarding completion:', error);
    throw error;
  }
};

// Fetch onboarding questions
export const getOnboardingQuestions = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/onboarding-questions');
    if (!response.ok) {
      throw new Error('Failed to fetch onboarding questions');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching onboarding questions:', error);
    return [];
  }
};

// Save user response to onboarding question
export const saveResponse = async (userId: number, questionId: number, answerIds: number[]) => {
  try {
    const response = await fetch('http://localhost:3000/api/save-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, questionId, answerIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to save response');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
};

// Fetch available equipment
export const getEquipment = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/equipment');
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
};