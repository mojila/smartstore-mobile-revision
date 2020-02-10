import React, { useEffect, useState } from 'react';
import { Layout, Text, Spinner, Button, Icon, Select, Input } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import OrderItem from '../component/orderItem';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl';
import moment from 'moment';

const days = Array.from({ length: 31 }, (e, i) => {
    if (i + 1 < 10) {
        return { text: `0${i + 1}` }
    } else {
        return { text: `${i + 1}` }
    }
})
const months = Array.from({ length: 12 }, (e, i) => {
    if (i + 1 < 10) {
        return { text: `0${i + 1}` }
    } else {
        return { text: `${i + 1}` }
    }
})

const OrderScreen = (props) => {
    const [orders, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(10);
    const [notes, setNotes] = useState('');
    const [requestfor, setRequestfor] = useState(new Date());
    const [type, setType] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({ 
        material: { id: 1, name: 'adaw', unit: 'pieces' }, 
        qty: 1, notes: '', requestfor: '', type: '' 
    });
    const [year, setYear] = useState(moment().format('YYYY'))
    const [day, setDay] = useState({ text: moment().format('DD') })
    const [month, setMonth] = useState({ text: moment().format('MM') })

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
                setOrder([]);
                setLoading(false);
                console.warn(err);
            });
        }
    };

    const deleteOrder = async (id) => {
        let token = await AsyncStorage.getItem('@auth_token');

        if (token !== null) {
            Axios.delete(`${newBackend}/order/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                fetchOrders();
                setShowModal(false);
            })
            .catch(err => {
                fetchOrders();
                setShowModal(false);
                console.warn(err);
            });
        }
    };

    const updateOrder = async (id) => {
        let token = await AsyncStorage.getItem('@auth_token');

        if (token !== null) {
            Axios.put(`${newBackend}/order/${id}`, {
                material_id: selectedOrder.material.id,
                qty: quantity,
                type: 'pesanan baru',
                notes: notes,
                requestfor: `${year}-${month}-${day}`
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                fetchOrders();
                setShowModal(false);
            })
            .catch(err => {
                fetchOrders();
                setShowModal(false);
                console.warn(err);
            });
        }
    };

    const addQuantity = () => setQuantity(quantity + 1);

    const reduceQuantity = () => {
        if (quantity > 1) {
            return setQuantity(quantity - 1);
        }
        return;
    };

    const renderModal = () => (<Layout style={{ padding: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#e3e3e3',
        borderRadius: 4, margin: 32, marginTop: 100 }}>
        <Layout style={{ flexDirection: 'column', marginBottom: 8 }}>
            <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Layout>
                    <Text>Material Name: </Text>
                </Layout>
                <Layout>
                    <Text>{selectedOrder.material.name}</Text>
                </Layout>
            </Layout>
            <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Layout>
                    <Text>Order quantity: </Text>
                </Layout>
                <Layout>
                    <Text>{selectedOrder.qty} {selectedOrder.material.unit}</Text>
                </Layout>
            </Layout>
        </Layout>
        <Layout style={{ marginBottom: 8, flexDirection: 'row' }}>
            <Button status="control" icon={renderIconDown}
                style={{ marginRight: 2 }} onPress={reduceQuantity}></Button>

            <Input value={quantity.toString()} keyboardType="number-pad"
                onChangeText={e => setQuantity(Number(e))} 
                style={{ flex: 1, marginRight: 2, marginTop: 1 }}/>
            
            <Button status="control" icon={renderIconUp} onPress={addQuantity}></Button>
        </Layout>
        <Layout style={{ marginTop: 8 }}>
            <Layout style={{ flexDirection: 'row',
                justifyContent: 'space-between' }}>
                <Select label="Day" data={days}
                    status="basic"
                    style={{ flex: 1, marginRight: 4 }}
                    placeholder="Day"
                    selectedOption={day}
                    onSelect={(e) => setDay(e)}/>
                <Select label="Month" data={months}
                    status="basic"
                    style={{ flex: 1, marginRight: 4 }}
                    placeholder="Month"
                    selectedOption={month}
                    onSelect={(e) => setMonth(e)}/>
                <Input label="Year" keyboardType="number-pad"
                    value={year}
                    onChangeText={(e) => setYear(e)}
                    placeholder="Year"/>
            </Layout>
            <Input label="Notes" value={notes} onChangeText={setNotes}/>
        </Layout>
        <Layout style={{ flexDirection: 'row', marginTop: 8 }}>
            <Button style={{ flex: 1, marginRight: 8 }} size="small" status="danger"
                onPress={() => deleteOrder(selectedOrder.id)}>Cancel Order</Button>
            <Button style={{ flex: 1 }} size="small" status="primary"
                onPress={() => updateOrder(selectedOrder.id)}>Update Order</Button>
        </Layout>
        <Layout style={{ marginTop: 8, flexDirection: 'row' }}>
            <Button style={{ flex: 1 }} size="small" appearance='outline' 
                onPress={() => setShowModal(false)}>Close</Button>
        </Layout>
    </Layout>)

    const renderIconUp = (style) => (<Icon name="arrow-ios-upward-outline" {...style}/>);
    const renderIconDown = (style) => (<Icon name="arrow-ios-downward-outline" {...style}/>);

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
                    {!loading && orders.length > 0 && orders.map((d, i) => <TouchableOpacity key={i}
                        onPress={() => {
                            let order_date = orders.filter(x => x.id === d.id)[0].requestfor.split('-')

                            setYear(order_date[0] === '0000' ? year : order_date[0])
                            setMonth(order_date[1] === '00' ? month : { text: order_date[1] })
                            setDay(order_date[2] === '00' ? day : { text: order_date[2] })

                            setSelectedOrder(orders.filter(x => x.id === d.id)[0]);
                            setQuantity(orders.filter(x => x.id === d.id)[0].qty);
                            setNotes(orders.filter(x => x.id === d.id)[0].notes);
                            setShowModal(true);
                        }}>
                        <OrderItem name={d.material ? d.material.name.substring(0,10):'-'} date={d.requestfor} quantity={d.qty} unit={d.material ? d.material.unit:'piece'}/>
                    </TouchableOpacity>)}
                </ScrollView>
            </SafeAreaView>
            <Modal visible={showModal}
                allowBackdrop={true}
                backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onBackdropPress={() => setShowModal(!showModal)}>
                {renderModal()}
            </Modal>
        </React.Fragment>
    );
}

export default OrderScreen;