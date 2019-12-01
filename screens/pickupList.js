import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Button } from 'react-native-ui-kitten';
import { AsyncStorage } from 'react-native';
import BottomTab from '../component/bottomTab';

const PickupListScreen = (props) => {
    return (
    <React.Fragment>
        <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row' }}>
            <Text>Pickup List</Text>
        </Layout>
        <BottomTab indexTab={1} navigation={props.navigation}/>
    </React.Fragment>
    );
}

export default PickupListScreen;