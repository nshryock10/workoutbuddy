import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export interface User {
  username: string;
  email: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;
export type HomeScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Home'>;
export type ProfileScreenNavigationProp = BottomTabNavigationProp<AppTabParamList, 'Profile'>;

// Type for AppNavigator props
export interface AppNavigatorProps {
  user: { username: string; email: string } | null;
  onLogout: () => void;
}


export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export interface AuthNavigatorProps {
  onLogin: (userData: User) => void;
}