import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;