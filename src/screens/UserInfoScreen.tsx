import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { COLORS, FONT, SIZES, BUTTONS, SHADOWS } from '@assets/constants/theme';
import { UserInfoScreenNavigationProp, OnboardingQuestion, EquipmentOption, RawEquipment, Option } from '../navigation/types';
import ProgressBar from '../components/ProgressBar';
import NavigationButtons from '../components/NavigationButtons';
import QuestionDisplay from '../components/QuestionDisplay';
import OptionList from '../components/OptionList';
import EquipmentOptionList from '../components/EquipmentOptionList';

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
  
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <QuestionDisplay question={currentQuestion.question} />
          {currentQuestion.question === 'Select your equipment: ' && shouldShowEquipmentQuestion() ? (
            equipment.length > 0 ? (
              <EquipmentOptionList
                equipment={equipment}
                selectedIds={responses[currentQuestion.id] || []}
                onSelect={handleResponse}
                questionId={currentQuestion.id}
              />
            ) : (
              <Text style={styles.loadingText}>No equipment available</Text>
            )
          ) : (
            <OptionList
              options={currentQuestion.options}
              selectedIds={responses[currentQuestion.id] || []}
              onSelect={handleResponse}
              responseType={currentQuestion.response_type}
              questionId={currentQuestion.id}
            />
          )}
        </View>
        <View style={styles.footer}>
          <ProgressBar progress={progressAnim} />
          <NavigationButtons onBack={goBack} onNext={saveResponseAndNext} />
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
    footer: {
      position: 'absolute',
      bottom: SIZES.xLarge,
      width: '80%',
      alignItems: 'center',
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