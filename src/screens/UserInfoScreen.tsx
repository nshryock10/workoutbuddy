import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, BUTTONS, SHADOWS } from '@assets/constants/theme';
import { UserInfoScreenNavigationProp, OnboardingQuestion, EquipmentOption, RawEquipment } from '../navigation/types';

interface UserInfoScreenProps {
  navigation: UserInfoScreenNavigationProp;
  user: { id: number; email: string };
}

const UserInfoScreen = ({ navigation, user }: UserInfoScreenProps) => {
  const [regularQuestions, setRegularQuestions] = useState<OnboardingQuestion[]>([]);
  const [equipmentQuestion, setEquipmentQuestion] = useState<OnboardingQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number[] }>({});
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [isEquipmentStep, setIsEquipmentStep] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchQuestions();
    fetchEquipment();
  }, []);

  useEffect(() => {
    const totalSteps = regularQuestions.length + (shouldShowEquipmentQuestion() ? 1 : 0);
    const progress = totalSteps > 0 ? (currentIndex + (isEquipmentStep ? 1 : 0) + 1) / totalSteps : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, regularQuestions.length, responses, isEquipmentStep]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/onboarding-questions');
      const data = await response.json();
      console.log('Fetched questions:', data);
      const equipmentQ = data.find((q: OnboardingQuestion) => q.question === 'Select your equipment: ');
      const regularQ = data.filter((q: OnboardingQuestion) => q.question !== 'Select your equipment: ');
      setEquipmentQuestion(equipmentQ || null);
      setRegularQuestions(regularQ);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Failed to load onboarding questions');
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/equipment');
      const data: RawEquipment[] = await response.json();
      const formattedData = data.map((item: RawEquipment) => ({
        id: item.id,
        option: item.option || item.description || 'Unknown',
        category: item.category
      }));
      console.log('Formatted equipment:', formattedData);
      setEquipment(formattedData);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      Alert.alert('Error', 'Failed to load equipment options');
    }
  };

  const handleResponse = (questionId: number, answerId: number, responseType: 'single' | 'multiple') => {
    setResponses((prev) => {
      const current = prev[questionId] || [];
      if (responseType === 'single') {
        return { ...prev, [questionId]: [answerId] };
      }
      return {
        ...prev,
        [questionId]: current.includes(answerId)
          ? current.filter((id) => id !== answerId)
          : [...current, answerId],
      };
    });
  };

  const shouldShowEquipmentQuestion = () => {
    const accessQuestion = regularQuestions.find(q => q.question === 'What equipment do you have access to?');
    if (!accessQuestion) {
      console.log('Access question not found');
      return false;
    }
    const selectSpecificId = accessQuestion.options.find(opt => opt.option === 'Select equipment')?.id;
    const shouldShow = selectSpecificId !== undefined && responses[accessQuestion.id]?.includes(selectSpecificId);
    console.log('Should show equipment:', { accessQuestionId: accessQuestion.id, selectSpecificId, responses: responses[accessQuestion.id], shouldShow });
    return shouldShow;
  };

  const saveResponseAndNext = async () => {
    const currentQuestion = isEquipmentStep && equipmentQuestion ? equipmentQuestion : regularQuestions[currentIndex];
    if (!responses[currentQuestion.id]?.length) {
      Alert.alert('Error', 'Please select at least one option');
      return;
    }

    try {
      console.log('Saving response:', { userId: user.id, questionId: currentQuestion.id, answerIds: responses[currentQuestion.id] });
      await fetch('http://localhost:3000/api/save-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          questionId: currentQuestion.id,
          answerIds: responses[currentQuestion.id],
        }),
      });

      const accessQuestionIndex = regularQuestions.findIndex(q => q.question === 'What equipment do you have access to?');

      if (isEquipmentStep && equipmentQuestion) {
        setIsEquipmentStep(false);
        if (currentIndex < regularQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          console.log('Completing onboarding after equipment');
          navigation.navigate('OnboardingComplete');
        }
      } else if (currentIndex === accessQuestionIndex && shouldShowEquipmentQuestion() && equipmentQuestion) {
        console.log('Switching to equipment question');
        setIsEquipmentStep(true);
      } else if (currentIndex < regularQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        console.log('Completing onboarding');
        navigation.navigate('OnboardingComplete');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      Alert.alert('Error', 'Failed to save response');
    }
  };

  const goBack = () => {
    if (isEquipmentStep && equipmentQuestion) {
      setIsEquipmentStep(false);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  if (regularQuestions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = isEquipmentStep && equipmentQuestion ? equipmentQuestion : regularQuestions[currentIndex];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const groupedEquipment = equipment.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {} as { [key: string]: EquipmentOption[] });

  const isEquipmentQuestion = currentQuestion.question === 'Select your equipment: ';
  const showEquipmentQuestion = isEquipmentQuestion && shouldShowEquipmentQuestion();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {showEquipmentQuestion ? (
          equipment.length > 0 ? (
            <ScrollView style={styles.scrollContainer}>
              {Object.entries(groupedEquipment).map(([category, items]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.map((eq) => (
                    <TouchableOpacity
                      key={eq.id}
                      style={styles.option}
                      onPress={() => handleResponse(currentQuestion.id, eq.id, 'multiple')}
                    >
                      <Icon
                        name={responses[currentQuestion.id]?.includes(eq.id) ? 'check-box' : 'check-box-outline-blank'}
                        size={SIZES.medium}
                        color={COLORS.primary}
                      />
                      <Text style={styles.optionText}>{eq.option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.loadingText}>No equipment available</Text>
          )
        ) : (
          currentQuestion.options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.option}
              onPress={() => handleResponse(currentQuestion.id, opt.id, currentQuestion.response_type)}
            >
              {currentQuestion.response_type === 'single' ? (
                <Icon
                  name={responses[currentQuestion.id]?.includes(opt.id) ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={SIZES.medium}
                  color={COLORS.primary}
                />
              ) : (
                <Icon
                  name={responses[currentQuestion.id]?.includes(opt.id) ? 'check-box' : 'check-box-outline-blank'}
                  size={SIZES.medium}
                  color={COLORS.primary}
                />
              )}
              <Text style={styles.optionText}>{opt.option}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={SIZES.large} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={saveResponseAndNext}>
            <Icon name="arrow-forward" size={SIZES.large} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
    flexGrow: 0,
  },
  scrollContainer: {
    maxHeight: '85%',
    width: '100%',
  },
  question: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  categorySection: {
    width: '100%',
    marginBottom: SIZES.medium,
  },
  categoryTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    color: COLORS.tertiary,
    marginBottom: SIZES.small,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    width: '100%',
    ...SHADOWS.small,
  },
  optionText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },
  footer: {
    position: 'absolute',
    bottom: SIZES.xLarge,
    width: '80%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.small,
    overflow: 'hidden',
    marginBottom: SIZES.medium,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.small,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  nextButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    ...SHADOWS.small,
  },
  backButton: {
    backgroundColor: COLORS.gray,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    ...SHADOWS.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
});

export default UserInfoScreen;