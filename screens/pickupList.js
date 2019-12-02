import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';
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