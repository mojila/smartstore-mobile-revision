import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';

export default function PickupItem(props) {
    return (<Layout style={{ flexDirection: 'row', justifyContent: 'space-between', 
        padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3' }}>
        <Text>{props.name}</Text>
        <Text>Stok: {props.quantity} {props.unit}</Text>
    </Layout>)
}