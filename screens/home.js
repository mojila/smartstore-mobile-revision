import React from 'react';
import { Layout } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createAppContainer } from 'react-navigation';
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
  return (
    <Layout style={{ flex: 1, marginTop: getStatusBarHeight() }}>
      <HomeScreenContent screenProps={{ rootNavigation: props.navigation }}/>
    </Layout>
  );
};

export default HomeScreen;