import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertMoroccanCurrency } from '../utils/currencyUtils';

const QUIZ_STORAGE_KEY = 'quiz_scores';
const QUESTIONS_PER_GAME = 20;
const QUESTIONS_PER_STAGE = 5;

export default function QuizScreen() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [earnedBills, setEarnedBills] = useState([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadBestScore();
  }, []);

  const loadBestScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      if (savedScore) {
        setBestScore(parseInt(savedScore));
      }
    } catch (error) {
      console.log('Failed to load best score:', error);
    }
  };

  const saveBestScore = async (newScore) => {
    try {
      if (newScore > bestScore) {
        await AsyncStorage.setItem(QUIZ_STORAGE_KEY, newScore.toString());
        setBestScore(newScore);
      }
    } catch (error) {
      console.log('Failed to save best score:', error);
    }
  };

  const generateQuestions = () => {
    const questionPool = [];

    // Stage 1: Basic conversions (Questions 1-5)
    const stage1Questions = [
      {
        stage: 1,
        question: t('quiz.questions.5000francs'),
        answer: convertMoroccanCurrency(5000, 'franc', 'dirham'),
        options: [5, 50, 500, 5000],
        unit: 'DH'
      },
      {
        stage: 1,
        question: t('quiz.questions.20ryals'),
        answer: convertMoroccanCurrency(20, 'ryal', 'dirham'),
        options: [0.1, 1, 10, 100],
        unit: 'DH'
      },
      {
        stage: 1,
        question: t('quiz.questions.250centimes'),
        answer: convertMoroccanCurrency(250, 'centime', 'dirham'),
        options: [2.5, 25, 250, 2500],
        unit: 'DH'
      },
      {
        stage: 1,
        question: t('quiz.questions.100dh'),
        answer: convertMoroccanCurrency(100, 'dirham', 'centime'),
        options: [100, 1000, 10000, 100000],
        unit: 'centimes'
      },
      {
        stage: 1,
        question: t('quiz.questions.50francs'),
        answer: convertMoroccanCurrency(50, 'franc', 'dirham'),
        options: [0.5, 5, 50, 500],
        unit: 'DH'
      },
    ];

    // Stage 2: Intermediate conversions (Questions 6-10)
    const stage2Questions = [
      {
        stage: 2,
        question: t('quiz.questions.1000centimes'),
        answer: convertMoroccanCurrency(1000, 'centime', 'dirham'),
        options: [1, 10, 100, 1000],
        unit: 'DH'
      },
      {
        stage: 2,
        question: t('quiz.questions.40ryals'),
        answer: convertMoroccanCurrency(40, 'ryal', 'dirham'),
        options: [0.2, 2, 20, 200],
        unit: 'DH'
      },
      {
        stage: 2,
        question: t('quiz.questions.5dh'),
        answer: convertMoroccanCurrency(5, 'dirham', 'centime'),
        options: [5, 50, 500, 5000],
        unit: 'centimes'
      },
      {
        stage: 2,
        question: t('quiz.questions.200francs'),
        answer: convertMoroccanCurrency(200, 'franc', 'dirham'),
        options: [2, 20, 200, 2000],
        unit: 'DH'
      },
      {
        stage: 2,
        question: t('quiz.questions.15dh'),
        answer: convertMoroccanCurrency(15, 'dirham', 'ryal'),
        options: [3, 30, 300, 3000],
        unit: 'ryals'
      },
    ];

    // Stage 3: Advanced conversions (Questions 11-15)
    const stage3Questions = [
      {
        stage: 3,
        question: t('quiz.questions.500ryals'),
        answer: convertMoroccanCurrency(500, 'ryal', 'dirham'),
        options: [2.5, 25, 250, 2500],
        unit: 'DH'
      },
      {
        stage: 3,
        question: t('quiz.questions.75dh'),
        answer: convertMoroccanCurrency(75, 'dirham', 'franc'),
        options: [7.5, 75, 750, 7500],
        unit: 'francs'
      },
      {
        stage: 3,
        question: t('quiz.questions.1500centimes'),
        answer: convertMoroccanCurrency(1500, 'centime', 'dirham'),
        options: [1.5, 15, 150, 1500],
        unit: 'DH'
      },
      {
        stage: 3,
        question: t('quiz.questions.30dh'),
        answer: convertMoroccanCurrency(30, 'dirham', 'ryal'),
        options: [6, 60, 600, 6000],
        unit: 'ryals'
      },
      {
        stage: 3,
        question: t('quiz.questions.800francs'),
        answer: convertMoroccanCurrency(800, 'franc', 'dirham'),
        options: [8, 80, 800, 8000],
        unit: 'DH'
      },
    ];

    // Stage 4: Expert conversions (Questions 16-20)
    const stage4Questions = [
      {
        stage: 4,
        question: t('quiz.questions.1200ryals'),
        answer: convertMoroccanCurrency(1200, 'ryal', 'dirham'),
        options: [6, 60, 600, 6000],
        unit: 'DH'
      },
      {
        stage: 4,
        question: t('quiz.questions.45dh'),
        answer: convertMoroccanCurrency(45, 'dirham', 'centime'),
        options: [4.5, 45, 450, 4500],
        unit: 'centimes'
      },
      {
        stage: 4,
        question: t('quiz.questions.2000francs'),
        answer: convertMoroccanCurrency(2000, 'franc', 'dirham'),
        options: [20, 200, 2000, 20000],
        unit: 'DH'
      },
      {
        stage: 4,
        question: t('quiz.questions.90dh'),
        answer: convertMoroccanCurrency(90, 'dirham', 'ryal'),
        options: [18, 180, 1800, 18000],
        unit: 'ryals'
      },
      {
        stage: 4,
        question: t('quiz.questions.3500centimes'),
        answer: convertMoroccanCurrency(3500, 'centime', 'dirham'),
        options: [3.5, 35, 350, 3500],
        unit: 'DH'
      },
    ];

    questionPool.push(...stage1Questions, ...stage2Questions, ...stage3Questions, ...stage4Questions);
    return questionPool;
  };

  const startGame = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setEarnedBills([]);
    setCurrentStage(1);
    setGameStarted(true);
    setGameEnded(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const selectAnswer = (answer) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answer);
    const correct = Math.abs(answer - questions[currentQuestion].answer) < 0.01;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Define bill values for each question (cycling through 20, 25, 50, 100, 200)
      const billValues = [20, 25, 50, 100, 200];
      const billValue = billValues[currentQuestion % billValues.length];
      
      setScore(score + billValue);
      setCorrectAnswers(correctAnswers + 1);
      setEarnedBills([...earnedBills, { value: billValue, image: getBanknoteImage(billValue) }]);
    }

    // Animate feedback
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (currentQuestion + 1 >= questions.length) {
      endGame();
    } else {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      
      // Update stage based on question number
      const newStage = Math.ceil((nextQuestionIndex + 1) / QUESTIONS_PER_STAGE);
      setCurrentStage(newStage);
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    saveBestScore(correctAnswers);
  };

  const resetGame = () => {
    setGameEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setEarnedBills([]);
    setCurrentStage(1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getBanknoteImage = (value) => {
    switch (value) {
      case 20:
        return require('../../assets/currency/bills/bill_20dh.png');
      case 25:
        return require('../../assets/currency/bills/bill_25dh.png');
      case 50:
        return require('../../assets/currency/bills/bill_50dh.png');
      case 100:
        return require('../../assets/currency/bills/bill_100dh.png');
      case 200:
        return require('../../assets/currency/bills/bill_200dh.png');
      default:
        return require('../../assets/currency/bills/bill_20dh.png');
    }
  };

  const getScoreBanknotes = () => {
    // Return only the most recent bill (last one earned)
    if (earnedBills.length === 0) {
      return [];
    }
    const lastBill = earnedBills[earnedBills.length - 1];
    console.log('Most recent bill:', lastBill.value, 'DH, Total value:', score, 'DH');
    return [lastBill];
  };

  if (!gameStarted && !gameEnded) {
    return (
      <ImageBackground 
        source={require('../../assets/background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>{t('quiz.title')}</Text>
            <Text style={styles.welcomeDescription}>
              {t('quiz.description')}
            </Text>
            
            {bestScore > 0 && (
              <View style={styles.bestScoreContainer}>
                <Text style={styles.bestScoreLabel}>{t('quiz.bestScore')}</Text>
                <Text style={styles.bestScoreValue}>{bestScore}/{QUESTIONS_PER_GAME}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>{t('quiz.start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (gameEnded) {
    return (
      <ImageBackground 
        source={require('../../assets/background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>{t('quiz.gameOver')}</Text>
            <View style={styles.finalScoreContainer}>
              <Text style={styles.finalScoreLabel}>{t('quiz.finalScore')}</Text>
              <Text style={styles.finalScoreValue}>{correctAnswers}/{QUESTIONS_PER_GAME}</Text>
              <Text style={styles.finalScoreTotal}>{score} DH</Text>
              <View style={styles.finalBanknoteContainer}>
                {getScoreBanknotes().map((banknote, index) => (
                  <View key={index} style={styles.finalBanknoteWrapper}>
                    <Image
                      source={banknote.image}
                      style={styles.finalBanknoteImage}
                      resizeMode="contain"
                      onError={() => console.log('Final image failed to load:', banknote.value)}
                    />
                    <Text style={styles.finalBanknoteValue}>{banknote.value}DH</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {score > bestScore && (
              <Text style={styles.newRecord}>{t('quiz.newRecord')}! 🎉</Text>
            )}

            <View style={styles.gameOverActions}>
              <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
                <Text style={styles.playAgainButtonText}>{t('quiz.playAgain')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <ImageBackground 
      source={require('../../assets/background.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.questionInfo}>
            <Text style={styles.questionCounter}>
              {t('quiz.question')} {currentQuestion + 1}/{questions.length}
            </Text>
            <Text style={styles.stageInfo}>
              {t('quiz.stage')} {currentStage}/4
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>{t('quiz.score')}:</Text>
            <Text style={styles.scoreNumber}>{score} DH</Text>
            <View style={styles.banknoteContainer}>
              {getScoreBanknotes().map((banknote, index) => (
                <View key={index} style={styles.banknoteWrapper}>
                  <Image
                    source={banknote.image}
                    style={styles.banknoteImage}
                    resizeMode="contain"
                    onError={() => console.log('Image failed to load:', banknote.value)}
                  />
                  <Text style={styles.banknoteValue}>{banknote.value}DH</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && isCorrect && styles.correctOption,
                selectedAnswer === option && !isCorrect && styles.incorrectOption,
                selectedAnswer !== null && option === question.answer && styles.correctOption,
              ]}
              onPress={() => selectAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === option && styles.selectedOptionText,
                selectedAnswer !== null && option === question.answer && styles.correctOptionText,
              ]}>
                {option} {question.unit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultText,
              { color: isCorrect ? '#4CAF50' : '#F44336' }
            ]}>
              {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
            </Text>
          </View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5F3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  bestScoreContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestScoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bestScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F3E',
  },
  startButton: {
    backgroundColor: '#2D5F3E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionInfo: {
    flex: 1,
  },
  questionCounter: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  stageInfo: {
    fontSize: 14,
    color: '#2D5F3E',
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scoreNumber: {
    fontSize: 18,
    color: '#2D5F3E',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  banknoteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 200,
  },
  banknoteWrapper: {
    alignItems: 'center',
    marginLeft: 2,
    marginBottom: 2,
  },
  banknoteImage: {
    width: 40,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  banknoteValue: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#ffebee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5F3E',
    marginBottom: 30,
  },
  finalScoreContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finalScoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  finalScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D5F3E',
    marginBottom: 8,
  },
  finalScoreTotal: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  finalBanknoteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  finalBanknoteWrapper: {
    alignItems: 'center',
    margin: 3,
  },
  finalBanknoteImage: {
    width: 50,
    height: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  finalBanknoteValue: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  newRecord: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  gameOverActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playAgainButton: {
    backgroundColor: '#2D5F3E',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


