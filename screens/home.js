import React, { useState, useEffect } from 'react';
import { Layout,
  BottomNavigation, 
  BottomNavigationTab } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ListScreen from './list';
import ProfileScreen from './profile';
import OrderScreen from './order';
import PickupListScreen from './pickupList';

const HomeNavigator = createStackNavigator(
  {
    List: ListScreen,
    PickupList: PickupListScreen,
    Order: OrderScreen,
    Profile: ProfileScreen,
  }, {
    initialRouteName: 'List',
    transitionConfig: () => ({ screenInterpolator: () => null }),
    headerMode: 'none',
  }
);

const HomeScreenContent = createAppContainer(HomeNavigator);

const HomeScreen = (props) => {
  // reset route stack
  // const reset = StackActions.reset({
  //   index: 0,
  //   actions: [NavigationActions.navigate({ routeName: 'Home' })],
  // });
  
  useEffect(() => {
    // props.navigation.dispatch(reset);
  }, []);

  return (
    <Layout style={{ flex: 1, marginTop: getStatusBarHeight() }}>
      <HomeScreenContent screenProps={{ rootNavigation: props.navigation }}/>
    </Layout>
  );
};

export default HomeScreen;