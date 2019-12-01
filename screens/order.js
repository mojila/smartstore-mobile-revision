import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Button } from 'react-native-ui-kitten';
import { AsyncStorage } from 'react-native';
import BottomTab from '../component/bottomTab';

const OrderScreen = (props) => {
    return (
    <React.Fragment>
        <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row' }}>
            <Text>Order</Text>
        </Layout>
        <BottomTab indexTab={2} navigation={props.navigation}/>
    </React.Fragment>
    );
}

export default OrderScreen;