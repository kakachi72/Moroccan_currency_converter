import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
import { responsiveFontSize } from '../utils/responsive';

import ConverterScreen from '../screens/ConverterScreen';
import TouristScreen from '../screens/TouristScreen';
import QuizScreen from '../screens/QuizScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Custom Header Component with Gradient Background
const GradientHeader = ({ title }) => (
  <LinearGradient
    colors={['#2D5F3E', '#8B0000']} // Green to Red gradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{
      color: 'white',
      fontSize: responsiveFontSize(18),
      fontWeight: 'bold',
      backgroundColor: 'transparent',
    }}>
      {title}
    </Text>
  </LinearGradient>
);

export default function AppNavigator() {
  const { t } = useTranslation();

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
          },
          headerBackground: () => <GradientHeader />,
        })}
      >
        <Tab.Screen 
          name="Converter" 
          component={ConverterScreen}
          options={{
            tabBarLabel: t('tabs.converter'),
            headerTitle: t('converter.title'),
          }}
        />
        <Tab.Screen 
          name="Tourist" 
          component={TouristScreen}
          options={{
            tabBarLabel: t('tabs.tourist'),
            headerTitle: t('tourist.title'),
          }}
        />
        <Tab.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{
            tabBarLabel: t('tabs.quiz'),
            headerTitle: t('quiz.title'),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarLabel: t('tabs.settings'),
            headerTitle: t('settings.title'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
