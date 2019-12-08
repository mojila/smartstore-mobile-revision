import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
// incoming version
// import { SQLite } from "expo-sqlite";

// const db = SQLite.openDatabase("db.db");

const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Login',
    transitionConfig: () => ({ screenInterpolator: () => null }),
    headerMode: 'none',
  }
);

const App = createAppContainer(AppNavigator);

const Main = (props) => {
  return (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <App/>
    </ApplicationProvider>
  );
}

export default Main;