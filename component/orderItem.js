import React from 'react';
import { Layout, Text } from 'react-native-ui-kitten';

export default function OrderItem(props) {
    return (<Layout style={{ flexDirection: 'row', justifyContent: 'space-between', 
        padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3' }}>
            <Text>{props.name}.. ({props.date})</Text>
            <Text>Qty: {props.quantity} {props.unit}</Text>
    </Layout>)
}