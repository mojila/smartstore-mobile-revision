import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';

const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Home',
    transitionConfig: () => ({ screenInterpolator: () => null }),
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);