import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ImageBackground,
  Image,
  Share,
} from 'react-native';
// Removed optional dependencies for simpler sharing
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertMoroccanCurrency } from '../utils/currencyUtils';
import { useInterstitialAd } from '../components/InterstitialAd';
import BannerAd from '../components/BannerAd';

const QUIZ_STORAGE_KEY = 'quiz_scores';
const QUESTIONS_PER_GAME = 25;
const QUESTIONS_PER_STAGE = 5;

export default function QuizScreen() {
  const { t, i18n } = useTranslation();
  // All languages now use LTR layout
  const { showInterstitialAd, preloadInterstitialAd } = useInterstitialAd();
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
  const [stageBreak, setStageBreak] = useState(false);
  const [stageScore, setStageScore] = useState(0);
  // Removed screenRef as it's no longer needed for sharing

  useEffect(() => {
    loadBestScore();
    // Preload interstitial ad for better performance
    preloadInterstitialAd();
  }, []);

  const loadBestScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      if (savedScore) {
        setBestScore(parseInt(savedScore));
      }
    } catch (error) {
      console.error('Failed to load best score:', error);
    }
  };

  const saveBestScore = async (newScore) => {
    try {
      if (newScore > bestScore) {
        await AsyncStorage.setItem(QUIZ_STORAGE_KEY, newScore.toString());
        setBestScore(newScore);
      }
    } catch (error) {
      console.error('Failed to save best score:', error);
    }
  };

  const generateQuestions = () => {
    const questionPool = [];

    const shuffleOptions = (options, correct) => {
      const unique = Array.from(new Set(options.concat([correct])));
      for (let i = unique.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = unique[i];
        unique[i] = unique[j];
        unique[j] = tmp;
      }
      return unique;
    };

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

    // Stage 5: Big numbers - Dirham to Centime (Questions 21-25)
    let stage5Questions = [
      {
        stage: 5,
        question: t('quiz.questions.1000dh'),
        answer: convertMoroccanCurrency(1000, 'dirham', 'centime'),
        options: [10000, 100000, 1000000, 10000000],
        unit: 'centimes'
      },
      {
        stage: 5,
        question: t('quiz.questions.5000dh'),
        answer: convertMoroccanCurrency(5000, 'dirham', 'centime'),
        options: [50000, 500000, 5000000, 50000000],
        unit: 'centimes'
      },
      {
        stage: 5,
        question: t('quiz.questions.10000dh'),
        answer: convertMoroccanCurrency(10000, 'dirham', 'centime'),
        options: [100000, 1000000, 10000000, 100000000],
        unit: 'centimes'
      },
      {
        stage: 5,
        question: t('quiz.questions.50000dh'),
        answer: convertMoroccanCurrency(50000, 'dirham', 'centime'),
        options: [500000, 5000000, 50000000, 500000000],
        unit: 'centimes'
      },
      {
        stage: 5,
        question: t('quiz.questions.100000dh'),
        answer: convertMoroccanCurrency(100000, 'dirham', 'centime'),
        options: [1000000, 10000000, 100000000, 1000000000],
        unit: 'centimes'
      },
    ];

    // Randomize options for Stage 5 so the correct answer isn't always in the same position
    stage5Questions = stage5Questions.map(q => ({
      ...q,
      options: shuffleOptions(q.options, q.answer),
    }));

    questionPool.push(...stage1Questions, ...stage2Questions, ...stage3Questions, ...stage4Questions, ...stage5Questions);
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
      const newStage = Math.ceil((nextQuestionIndex + 1) / QUESTIONS_PER_STAGE);
      
      // Check if we're moving to a new stage
      if (newStage > currentStage) {
        // Calculate stage score (correct answers in current stage)
        const stageStartQuestion = (currentStage - 1) * QUESTIONS_PER_STAGE;
        const stageEndQuestion = currentStage * QUESTIONS_PER_STAGE;
        const stageCorrectAnswers = questions.slice(stageStartQuestion, stageEndQuestion).length;
        setStageScore(stageCorrectAnswers);
        setStageBreak(true);
        setCurrentStage(newStage);
      } else {
        setCurrentQuestion(nextQuestionIndex);
      }
    }
  };

  const continueToNextStage = () => {
    setStageBreak(false);
    setCurrentQuestion(currentQuestion + 1);
    
    // Show interstitial ad after each stage completion
    setTimeout(() => {
      showInterstitialAd();
      // Preload next ad for better performance
      preloadInterstitialAd();
    }, 500); // Small delay to ensure UI transition is smooth
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    saveBestScore(correctAnswers);
    
    // Show interstitial ad after quiz completion
    setTimeout(() => {
      showInterstitialAd();
      // Preload next ad for future games
      preloadInterstitialAd();
    }, 1000); // Small delay to ensure UI is ready
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
    setStageBreak(false);
    setStageScore(0);
  };

  const shareResult = async () => {
    try {
      const appUrl = 'https://play.google.com/store/apps/details?id=com.dirhamy.app';
      const shareMessage = `I scored ${correctAnswers}/${QUESTIONS_PER_GAME} in Dirhamy! ${score} DH total. Try the app: ${appUrl}`;

      // Simple text-only sharing
      await Share.share({ 
        message: shareMessage, 
        title: t('quiz.title'),
        url: appUrl 
      });
    } catch (error) {
      console.error('Error sharing result:', error);
      Alert.alert(t('common.error'), 'Failed to share result');
    }
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

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getScoreBanknotes = () => {
    // Return only the most recent bill (last one earned)
    if (earnedBills.length === 0) {
      return [];
    }
    const lastBill = earnedBills[earnedBills.length - 1];
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
          <BannerAd placement="quiz_welcome_bottom" />
        </View>
      </ImageBackground>
    );
  }

  if (stageBreak) {
    return (
      <ImageBackground 
        source={require('../../assets/background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.stageBreakContainer}>
          <Text style={styles.stageBreakTitle}>
            {t('quiz.stageComplete')} {currentStage - 1}!
          </Text>
          <Text style={styles.stageBreakSubtitle}>
            {t('quiz.stageScore')}: {stageScore}/{QUESTIONS_PER_STAGE}
          </Text>
          <View style={styles.stageBreakStats}>
            <Text style={styles.stageBreakText}>
              {t('quiz.totalScore')}: {score} DH
            </Text>
            <Text style={styles.stageBreakText}>
              {t('quiz.correctAnswers')}: {correctAnswers}/{QUESTIONS_PER_GAME}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={continueToNextStage}
          >
            <Text style={styles.continueButtonText}>
              {t('quiz.continueToStage')} {currentStage}
            </Text>
          </TouchableOpacity>
        </View>
        <BannerAd placement="quiz_stage_break_bottom" />
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
                      onError={() => console.error('Final image failed to load:', banknote.value)}
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
              <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
                <Text style={styles.shareButtonText}>🔗 {t('settings.share')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
                <Text style={styles.playAgainButtonText}>{t('quiz.playAgain')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BannerAd placement="quiz_gameover_bottom" />
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
              {t('quiz.stage')} {currentStage}/5
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
                      onError={() => console.error('Image failed to load:', banknote.value)}
                  />
                  <Text style={styles.banknoteValue}>{banknote.value}DH</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {showResult && (
          <View style={styles.topResultContainer}>
            <Text style={[
              styles.topResultText,
              { color: isCorrect ? '#4CAF50' : '#F44336' }
            ]}>
              {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
          </Text>
        </View>
        )}

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {question.question}
          </Text>
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
                {formatNumber(option)} {question.unit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <BannerAd placement="quiz_in_game_bottom" />
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
    writingDirection: 'ltr', // Force LTR for numbers
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
    writingDirection: 'ltr', // Force LTR for numbers
  },
  finalScoreTotal: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    writingDirection: 'ltr', // Force LTR for numbers
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
  shareButton: {
    backgroundColor: '#ffffff',
    borderColor: '#2D5F3E',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  shareButtonText: {
    color: '#2D5F3E',
    fontSize: 16,
    fontWeight: 'bold',
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
  // Stage break styles
  stageBreakContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stageBreakTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5F3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  stageBreakSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F39C12',
    textAlign: 'center',
    marginBottom: 30,
  },
  stageBreakStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  stageBreakText: {
    fontSize: 18,
    color: '#2D5F3E',
    marginBottom: 10,
    textAlign: 'center',
    writingDirection: 'ltr', // Force LTR for numbers
  },
  continueButton: {
    backgroundColor: '#2D5F3E',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Top result message styles
  topResultContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  topResultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
});


