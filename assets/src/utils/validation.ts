export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international phone number format
    return phone === '' || phoneRegex.test(phone);
  };
  
  export const validateBirthday = (birthday: Date): boolean => {
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate()); // Minimum age 13
    return birthday <= minAgeDate && birthday >= new Date(1900, 0, 1); // Reasonable range
  };