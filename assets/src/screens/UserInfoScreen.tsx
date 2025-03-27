import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT, SIZES, BUTTONS, SHADOWS } from '@assets/constants/theme';
import { UserInfoScreenNavigationProp, OnboardingQuestion } from '../navigation/types';

interface UserInfoScreenProps {
  navigation: UserInfoScreenNavigationProp;
  user: { id: number; email: string };
}

const UserInfoScreen = ({ navigation, user }: UserInfoScreenProps) => {
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number[] }>({});
  const progressAnim = useRef(new Animated.Value(0)).current; // Animated value for progress

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    // Animate progress bar when currentIndex or questions.length changes
    const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300, // 300ms for a smooth slide
      useNativeDriver: false, // Width animation requires non-native driver
    }).start();
  }, [currentIndex, questions.length]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/onboarding-questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Failed to load onboarding questions');
    }
  };

  const handleResponse = (questionId: number, answerId: number, responseType: 'single' | 'multiple') => {
    setResponses((prev) => {
      if (responseType === 'single') {
        return { ...prev, [questionId]: [answerId] };
      } else {
        const current = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: current.includes(answerId)
            ? current.filter((id) => id !== answerId)
            : [...current, answerId],
        };
      }
    });
  };

  const saveResponseAndNext = async () => {
    const currentQuestion = questions[currentIndex];
    if (!responses[currentQuestion.id]?.length) {
      Alert.alert('Error', 'Please select at least one option');
      return;
    }

    try {
      await fetch('http://localhost:3000/api/save-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          questionId: currentQuestion.id,
          answerIds: responses[currentQuestion.id],
        }),
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigation.navigate('OnboardingComplete');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      Alert.alert('Error', 'Failed to save response');
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((opt) => (
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
        ))}
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
  question: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
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