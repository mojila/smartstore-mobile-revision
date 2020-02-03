import React, { useEffect, useState } from 'react';
import { AsyncStorage, Modal, TouchableOpacity } from 'react-native';
import { Layout, Text, Spinner, Button, Icon, Input, Datepicker } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import PickupItem from '../component/pickupItem';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl';
import moment from 'moment';

const PickupScreen = (props) => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(10);
    const [selectedPickup, setSelectedPickup] = useState({ material: { name: 'adaw', unit: 'pieces' }, qty: 1 });
    const [date, setDate] = useState(new Date());

    const fetchPickups = async () => {
        setLoading(true);
        let token = await AsyncStorage.getItem('@auth_token');
        
        if (token !== null) {
            Axios.get(`${newBackend}/pickup`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.data) {
                    setPickups(res.data['data']);
                }
            })
            .then(() => setLoading(false))
            .catch(err => {
                console.warn(err);
                setPickups([]);
                setLoading(false);
            });
        }
    };

    const deletePickup = async (id) => {
        let token = await AsyncStorage.getItem('@auth_token');

        if (token !== null) {
            Axios.delete(`${newBackend}/pickup/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                fetchPickups();
                setShowModal(false);
            })
            .catch(err => {
                fetchPickups();
                setShowModal(false);
                console.warn(err);
            });
        }
    };

    const updatePickup = async (id) => {
        let token = await AsyncStorage.getItem('@auth_token');

        if (token !== null) {
            Axios.put(`${newBackend}/pickup/${id}`, {
                material_id: selectedPickup.material.id,
                qty: quantity,
                picked_date: moment(date).format('YYYY-MM-DD')
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                fetchPickups();
                setShowModal(false);
            })
            .catch(err => {
                fetchPickups();
                setShowModal(false);
                console.warn(err);
            });
        }
    }

    const addQuantity = () => setQuantity(quantity + 1);

    const reduceQuantity = () => {
        if (quantity > 1) {
            return setQuantity(quantity - 1);
        }
        return;
    };

    const renderIconUp = (style) => (<Icon name="arrow-ios-upward-outline" {...style}/>)
    const renderIconDown = (style) => (<Icon name="arrow-ios-downward-outline" {...style}/>)

    useEffect(() => {
        fetchPickups();
    }, [setPickups, setLoading])

    return (<React.Fragment>
        <Layout style={{ padding: 16, elevation: 1, flexDirection: 'row', marginTop: getStatusBarHeight(), justifyContent: 'space-between' }}>
            <Text>Pickup List</Text>
            <Button size="tiny" onPress={fetchPickups}>Refresh</Button>
        </Layout>
        <SafeAreaView>
            <ScrollView>
                { loading && <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', 
                    padding: 8, borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
                    <Layout style={{ flex: 1 }}>
                        <Text>Loading Pickup Item ...</Text>
                    </Layout>
                    <Layout>
                        <Spinner/>
                    </Layout>
                </Layout> }
                {!loading && pickups.length < 1 && <Layout style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'center' }}>
                    <Text>There is no pickup item.</Text>
                </Layout>}
                {!loading && pickups.length > 0 && pickups.map((d, i) => <TouchableOpacity key={i}
                    onPress={() => {
                        setSelectedPickup(pickups.filter(x => x.id === d.id)[0]);
                        setQuantity(pickups.filter(x => x.id === d.id)[0].qty);
                        setShowModal(true);
                    }}>
                    <PickupItem name={d.material ? d.material.name.substring(0,10):'-'} 
                        quantity={d.qty} 
                        unit={d.material ? d.material.unit:'piece'}
                        date={d.picked_date}/>
                </TouchableOpacity>)}
            </ScrollView>
        </SafeAreaView>
        <Modal visible={showModal} transparent>
            <Layout style={{ padding: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#e3e3e3',
                borderRadius: 4, margin: 32, marginTop: 100 }}>
                <Layout style={{ flexDirection: 'column', marginBottom: 8 }}>
                    <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Layout>
                            <Text>WO: </Text>
                        </Layout>
                        <Layout>
                            <Text>{selectedPickup.wo}</Text>
                        </Layout>
                    </Layout>
                    <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Layout>
                            <Text>Material Name: </Text>
                        </Layout>
                        <Layout>
                            <Text>{selectedPickup.material.name}</Text>
                        </Layout>
                    </Layout>
                    <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Layout>
                            <Text>Pickup quantity: </Text>
                        </Layout>
                        <Layout>
                            <Text>{selectedPickup.qty} {selectedPickup.material.unit}</Text>
                        </Layout>
                    </Layout>
                    <Layout style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 8 }}>
                        <Layout>
                            <Text>Pickup date: </Text>
                        </Layout>
                        <Layout>
                            <Text>{selectedPickup.picked_date}</Text>
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
                <Layout style={{ marginBottom: 8 }}>
                    <Datepicker date={date} onSelect={setDate}/>
                </Layout>
                <Layout style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Button style={{ flex: 1, marginRight: 8 }} size="small" status="danger"
                        onPress={() => deletePickup(selectedPickup.id)}>Cancel Pickup</Button>
                    <Button style={{ flex: 1 }} size="small" status="primary"
                        onPress={() => updatePickup(selectedPickup.id)}>Update Pickup</Button>
                </Layout>
                <Button size="small" appearance='outline' onPress={() => setShowModal(false)}>Close</Button>
            </Layout>
        </Modal>
    </React.Fragment>);
}

export default PickupScreen;