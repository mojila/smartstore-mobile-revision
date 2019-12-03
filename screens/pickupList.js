import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const PickupListScreen = (props) => {
    return (
    <React.Fragment>
        <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row', marginTop: getStatusBarHeight() }}>
            <Text>Pickup List</Text>
        </Layout>
    </React.Fragment>
    );
}

export default PickupListScreen;