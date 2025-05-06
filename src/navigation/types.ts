import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export interface UserResponse {
  id: number;
  user_id: number;
  question_id: number;
  answer_id: number;
  option: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  sex?: 'male' | 'female';
  birthday?: string;
  hasCompletedOnboarding?: boolean;
  responses?: UserResponse[];
  token?: string;
}

export interface OnboardingQuestion {
  id: number;
  question: string;
  response_type: 'single' | 'multiple';
  options: { id: number; option: string }[];
}

export interface EquipmentOption {
  id: number;
  option: string;
  category: string;
}

export interface RawEquipment {
  id: number;
  option?: string;
  description?: string;
  category: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Profile: undefined;
  Movements: undefined; // Added new tab
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  UserInfo: undefined;
  OnboardingComplete: undefined;
};

export interface Option {
  id: number;
  option: string;
}

export type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;
export type HomeScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Home'>;
export type ProfileScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Profile'>;
export type MovementsScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Movements'>; // Added
export type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;
export type UserInfoScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'UserInfo'>;
export type OnboardingCompleteScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'OnboardingComplete'>;

export interface AppNavigatorProps {
  user: User | null;
  onLogout: () => void;
}

export interface AuthNavigatorProps {
  onLogin: (userData: User) => void;
}

export interface OnboardingNavigatorProps {
  onComplete: () => void;
  user: User;
}