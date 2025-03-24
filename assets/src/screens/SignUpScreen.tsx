import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONT, SIZES, SHADOWS } from '@assets/constants/theme';
import { SignUpScreenNavigationProp } from '../navigation/types';
import { validatePhone, validateBirthday } from '../utils/validation';

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('not_specified');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Username, email, and password are required');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Invalid phone number format');
      return;
    }
    if (birthday && !validateBirthday(birthday)) {
      Alert.alert('Error', 'Birthday must be valid and user must be at least 13 years old');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          phone,
          firstName,
          lastName,
          sex,
          birthday: birthday ? birthday.toISOString().split('T')[0] : null,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created! Please sign in.');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', data.message || 'Sign-up failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server');
      console.error(error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate || null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="First Name (optional)" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name (optional)" value={lastName} onChangeText={setLastName} />
      <Picker
        selectedValue={sex}
        style={styles.picker}
        onValueChange={(itemValue) => setSex(itemValue)}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Choose not to specify" value="not_specified" />
      </Picker>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{birthday ? birthday.toLocaleDateString() : 'Select Birthday (optional)'}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthday || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign Up" color={COLORS.primary} onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.large,
  },
  input: {
    width: '80%',
    padding: SIZES.small,
    marginBottom: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    ...SHADOWS.small,
  },
  picker: {
    width: '80%',
    marginBottom: SIZES.large,
  },
  dateButton: {
    width: '80%',
    padding: SIZES.small,
    marginBottom: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  link: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginTop: SIZES.large,
  },
});

export default SignUpScreen;