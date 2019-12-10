import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
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
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <App/>
      </ApplicationProvider>
    </React.Fragment>
  );
}

export default Main;