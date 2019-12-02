import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';
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