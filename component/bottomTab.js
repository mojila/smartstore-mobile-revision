import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationTab } from 'react-native-ui-kitten';

const BottomTab = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(props.indexTab);
    const tabNavigate = (e) => {
        switch(e) {
            case 0:
                props.navigation.navigate('List');
                break;
            case 1:
                props.navigation.navigate('PickupList');
                break;
            case 2:
                props.navigation.navigate('Order');
                break;
            case 3:
                props.navigation.navigate('Profile');
                break;
            default:
                break;
        }   
    };

    return (
    <BottomNavigation style={{ position: 'absolute', zIndex: 99, bottom: 0, elevation: 1 }}
        selectedIndex={props.indexTab || selectedIndex}
        onSelect={(e) => {
            setSelectedIndex(e);
            tabNavigate(e);
        }}>
        <BottomNavigationTab title='INVENTORY'/>
        <BottomNavigationTab title='PICKUP LIST'/>
        <BottomNavigationTab title='ORDER'/>
        <BottomNavigationTab title='PROFILE'/>
    </BottomNavigation>
    );
};

export default BottomTab;