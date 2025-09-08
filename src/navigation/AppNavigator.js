import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Image } from 'react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from '../utils/responsive';

import ConverterScreen from '../screens/ConverterScreen';
import TouristScreen from '../screens/TouristScreen';
import QuizScreen from '../screens/QuizScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Component to display the Dirhamy image in the header
const DirhamyImageHeader = () => (
  <Image
    source={require('../../assets/Dirhamy.png')} // Your Dirhamy image
    style={{
      width: 120, // Fixed width for crisp display
      height: 40, // Fixed height for crisp display
      resizeMode: 'contain',
    }}
  />
);

// Gradient background for all headers
const GradientBackground = () => (
  <LinearGradient
    colors={['#2D5F3E', '#8B0000']} // Green to Red gradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      flex: 1,
    }}
  />
);

export default function AppNavigator() {
  const { t, ready } = useTranslation();

  // Fallback translations in case i18n is not ready
  const getTranslation = (key, fallback) => {
    if (ready && t) {
      return t(key);
    }
    return fallback;
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Converter') {
              iconName = focused ? 'calculator' : 'calculator-outline';
            } else if (route.name === 'Tourist') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Quiz') {
              iconName = focused ? 'game-controller' : 'game-controller-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2D5F3E',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: 'transparent',
            height: 60, // Reduced header height
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            color: '#fff',
          },
          headerTitleAlign: 'center',
          headerBackground: () => <GradientBackground />,
        })}
      >
        <Tab.Screen 
          name="Converter" 
          component={ConverterScreen}
          options={{
            tabBarLabel: getTranslation('tabs.converter', 'Converter'),
            headerTitle: () => <DirhamyImageHeader />, // Show Dirhamy image only on Converter screen
          }}
        />
        <Tab.Screen 
          name="Tourist" 
          component={TouristScreen}
          options={{
            tabBarLabel: getTranslation('tabs.tourist', 'Tourist'),
            headerTitle: getTranslation('tourist.title', 'Currency Guide'),
          }}
        />
        <Tab.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{
            tabBarLabel: getTranslation('tabs.quiz', 'Quiz'),
            headerTitle: getTranslation('quiz.title', 'Currency Quiz'),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarLabel: getTranslation('tabs.settings', 'Settings'),
            headerTitle: getTranslation('settings.title', 'Settings'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
