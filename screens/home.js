import React from 'react';
import { BottomNavigationTab, BottomNavigation } from 'react-native-ui-kitten';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ListScreen from './list';
import ProfileScreen from './profile';
import OrderScreen from './order';
import PickupScreen from './pickup';

const TabBarComponent = ({ navigation }) => {
  const onSelect = (index) => {
    const { [index]: selectedTabRoute } = navigation.state.routes;
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={navigation.state.index} onSelect={onSelect}>
        <BottomNavigationTab title='LIST'/>
        <BottomNavigationTab title='ORDER'/>
        <BottomNavigationTab title='PICKUP'/>
        <BottomNavigationTab title='PROFILE'/>
      </BottomNavigation>
    </SafeAreaView>
  );
};

const TabNavigator = createBottomTabNavigator({
  List: ListScreen,
  Order: OrderScreen,
  Pickup: PickupScreen,
  Profile: ProfileScreen
}, {
  tabBarComponent: TabBarComponent,
});

const AppNavigator = createAppContainer(TabNavigator);

const HomeScreen = (props) => {
  return (
    <AppNavigator screenProps={{ rootNavigation: props.navigation }}/>
  );
};

export default HomeScreen;