import * as Crypto from 'expo-crypto';

export const generateWorkoutId = async (): Promise<string> => {
  return Crypto.randomUUID();
};