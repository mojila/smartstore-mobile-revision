import React, { useEffect, useState } from 'react';
import { Layout, Text, Spinner, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import OrderItem from '../component/orderItem';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl';

const OrderScreen = (props) => {
    const [orders, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        let token = await AsyncStorage.getItem('@auth_token');
        
        if (token !== null) {
            Axios.get(`${newBackend}/order`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.data) {
                    setOrder(res.data['data']);
                }
            })
            .then(() => setLoading(false))
            .catch(err => {
                console.warn(err);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [setOrder, setLoading]);

    return (
        <React.Fragment>
            <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row', marginTop: getStatusBarHeight(), justifyContent: 'space-between' }}>
                <Text>Order</Text>
                <Button size="tiny" onPress={fetchOrders}>Refresh</Button>
            </Layout>
            <SafeAreaView>
            <ScrollView>
                { loading && <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', 
                    padding: 8, borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
                    <Layout style={{ flex: 1 }}>
                        <Text>Loading Order Item ...</Text>
                    </Layout>
                    <Layout>
                        <Spinner/>
                    </Layout>
                </Layout> }
                {!loading && orders.length < 1 && <Layout style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                    <Text>There is no order item.</Text>
                </Layout>}
                {!loading && orders.length > 0 && orders.map((d, i) => <TouchableHighlight key={i}>
                    <OrderItem name={d.material ? d.material.name:'-'} date={d.requestfor} quantity={d.qty} unit={d.material ? d.material.unit:'piece'}/>
                </TouchableHighlight>)}
            </ScrollView>
        </SafeAreaView>
        </React.Fragment>
    );
}

export default OrderScreen;