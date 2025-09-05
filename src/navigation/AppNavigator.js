import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import ConverterScreen from '../screens/ConverterScreen';
import TouristScreen from '../screens/TouristScreen';
import QuizScreen from '../screens/QuizScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

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
            backgroundColor: '#2D5F3E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
