import React, { useEffect } from 'react';
import { Layout, Text } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { refreshToken } from './login';

const OrderScreen = (props) => {
    useEffect(() => {
    }, []);

    return (
        <React.Fragment>
            <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row', marginTop: getStatusBarHeight() }}>
                <Text>Order</Text>
            </Layout>
        </React.Fragment>
    );
}

export default OrderScreen;