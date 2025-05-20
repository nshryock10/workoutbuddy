import { v4 as uuidv4 } from 'uuid';

export const generateWorkoutId = (): number => {
  const uuid = uuidv4();
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash << 5) - hash + uuid.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash;
};