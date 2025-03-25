import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export interface User {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  sex?: 'male' | 'female' | 'not_specified';
  birthday?: string;
  hasCompletedOnboarding?: boolean;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  UserInfo: undefined;
  OnboardingComplete: undefined;
};

export type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;
export type HomeScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Home'>;
export type ProfileScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Profile'>;
export type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;
export type UserInfoScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'UserInfo'>;
export type OnboardingCompleteScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'OnboardingComplete'>;

// Type for AppNavigator props
export interface AppNavigatorProps {
  user: User | null;
  onLogout: () => void;
}

export interface OnboardingNavigatorProps {
  onComplete: () => void;
  user: User;
}

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export interface AuthNavigatorProps {
  onLogin: (userData: User) => void;
}