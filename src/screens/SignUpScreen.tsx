import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, SHADOWS, BUTTONS } from '@assets/constants/theme';
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
  const [sex, setSex] = useState('male');
  const [birthdayInput, setBirthdayInput] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [password, setPassword] = useState('');
  const [sexInfoVisible, setSexInfoVisible] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !phone || !firstName || !lastName || !sex || !birthday || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Invalid phone number format');
      return;
    }
    if (!validateBirthday(birthday)) {
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
          birthday: birthday.toISOString().split('T')[0],
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

  const handleBirthdayInput = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2); // MM
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4); // DD
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8); // YYYY
    setBirthdayInput(formatted);

    if (cleaned.length === 8) {
      const [month, day, year] = [cleaned.substring(0, 2), cleaned.substring(2, 4), cleaned.substring(4, 8)];
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime()) && validateBirthday(date)) setBirthday(date);
      else {
        setBirthday(null);
        Alert.alert('Error', 'Invalid date format');
      }
    } else {
      setBirthday(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <View style={styles.radioContainer}>
        <TouchableOpacity style={styles.radioOption} onPress={() => setSex('male')}>
          <Text style={sex === 'male' ? styles.radioSelected : styles.radioText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioOption} onPress={() => setSex('female')}>
          <Text style={sex === 'female' ? styles.radioSelected : styles.radioText}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.infoLinkContainer} onPress={() => setSexInfoVisible(true)}>
        <Text style={styles.infoLink}>Which one should I choose?</Text>
        <Icon name="info-outline" size={SIZES.medium} color={COLORS.secondary} style={styles.infoIcon} />
      </TouchableOpacity>
      <Modal visible={sexInfoVisible} transparent={true} animationType="fade" onRequestClose={() => setSexInfoVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Which one should I choose?</Text>
            <Text style={styles.modalText}>
              Male and female sex hormones affect metabolism. We calculate calorie needs differently depending on the sex you select. If you are intersex, taking gender-affirming medications, or aren’t sure which to select for your needs, select the one that most closely aligns with your hormonal state.
            </Text>
            <TouchableOpacity style={BUTTONS.secondary} onPress={() => setSexInfoVisible(false)}>
              <Text style={BUTTONS.secondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="MM/DD/YYYY"
        value={birthdayInput}
        onChangeText={handleBirthdayInput}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={BUTTONS.primary} onPress={handleSignUp}>
        <Text style={BUTTONS.primaryText}>Sign Up</Text>
      </TouchableOpacity>
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
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: SIZES.small,
  },
  radioOption: {
    paddingHorizontal: SIZES.small,
  },
  radioText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontFamily: FONT.regular,
  },
  radioSelected: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  infoLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  infoLink: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    fontFamily: FONT.regular,
  },
  infoIcon: {
    marginLeft: SIZES.small,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  modalText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  link: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginTop: SIZES.large,
  },
});

export default SignUpScreen;