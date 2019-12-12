import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Modal, Button, Icon, Datepicker } from 'react-native-ui-kitten';
import { ImageBackground, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { oldBackend, newBackend } from '../constant/apiUrl';
import moment from 'moment';

const ListScreen = (props) => {
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState({ id: 0, name: '' });
    const [quantity, setQuantity] = useState(1);
    const [successPrompt, setSuccessPrompt] = useState(false);
    const [errorPrompt, setErrorPrompt] = useState(false);
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    const search = () => {
        setLoading(true);
        return axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity&search=${searchKeyword}`)
            .then((res) => setMaterials(res.data.results))
            .then(() => setLoading(false))
            .catch(err => console.log(new Error(err)));
    };

    const getMaterials = () => {
        return axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity`)
            .then((res) => setMaterials(res.data.results))
            .then(() => setLoading(false))
            .catch(err => console.log(new Error(err)));
    };

    const addQuantity = () => setQuantity(quantity + 1);

    const reduceQuantity = () => {
        if (quantity > 1) {
            return setQuantity(quantity - 1);
        }
        return;
    };

    const createOrder = async () => {
        let token = await AsyncStorage.getItem('@auth_token');

        return axios.post(`${newBackend}/order`, {
            'material_id': selectedMaterial.id,
            'type': 'pesanan baru',
            'qty': quantity,
            'requestfor': moment(date).format('YYYY-MM-DD'),
            'notes': notes
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.status === 200 ? setSuccessPrompt(true):'')
        .then(() => setModalShow(false))
        .catch(() => {
            setErrorPrompt(true);
            setModalShow(false);
        });
    };

    const createPickup = async () => {
        let token = await AsyncStorage.getItem('@auth_token');

        return axios.post(`${newBackend}/pickup`, {
            'material_id': selectedMaterial['id'],
            'qty': quantity
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.status === 200 ? setSuccessPrompt(true):'')
        .then(() => setModalShow(false))
        .catch(() => {
            setErrorPrompt(true);
            setModalShow(false);
        });
    };

    const renderSuccess = () => (<Layout level="3" style={{
            width: 300,
            padding: 16,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            alignItems: 'center'
        }}>
            <Text status="success">Success</Text>
        </Layout>)

    const renderError = () => (<Layout level="3" style={{
            width: 300,
            padding: 16,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            alignItems: 'center'
        }}>
            <Text status="danger">Failed.</Text>
        </Layout>)

    const renderModal = () => (
        <Layout level="3" style={{
            width: 300,
            padding: 16,
            borderRadius: 4,
            backgroundColor: '#ffffff'
        }}>
            <Text>Material Name: {selectedMaterial.name}</Text>
            <Text>Category: {selectedMaterial.category ? selectedMaterial.category.name : 'Uncategorized'}</Text>
            <Text>Stock: {selectedMaterial.quantity} {selectedMaterial.unit}</Text>
            <Text>Company Code: {selectedMaterial.company_code}</Text>
            <Text>Location: Rak {selectedMaterial.shelf_code} Box {selectedMaterial.box_code}</Text>
            <Layout style={{ marginTop: 8, flexDirection: 'row', paddingTop: 4, borderTopColor: '#e3e3e3', borderTopWidth: 1 }}>
                <Button status="control" icon={renderIconDown}
                    style={{ marginRight: 2 }} onPress={reduceQuantity}></Button>

                <Input value={quantity.toString()} keyboardType="number-pad"
                    onChangeText={e => setQuantity(Number(e))} 
                    style={{ flex: 1, marginRight: 2, marginTop: 1 }}/>
                
                <Button status="control" icon={renderIconUp} onPress={addQuantity}></Button>
            </Layout>
            { quantity > selectedMaterial.quantity && <Layout style={{ marginTop: 4 }}>
                <Datepicker date={date} onSelect={setDate}/>
                <Input label="Notes" value={notes} onChangeText={setNotes}/>
            </Layout> }
            <Layout style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between',  }}>
                <Button status="success" disabled={quantity <= selectedMaterial.quantity} style={{ flex: 1, marginRight: 2 }}
                    onPress={createOrder}>Order</Button>
                <Button status="primary" disabled={quantity > selectedMaterial.quantity} style={{ flex: 1 }}
                    onPress={createPickup}>Pickup</Button>
            </Layout>
        </Layout>
    );

    const renderIconUp = (style) => (<Icon name="arrow-ios-upward-outline" {...style}/>)
    const renderIconDown = (style) => (<Icon name="arrow-ios-downward-outline" {...style}/>)

    const selectMaterial = async (id) => {
        let material = materials.filter(x => x.id === id)[0];
        setSelectedMaterial(material);
        setQuantity(1);

        return setModalShow(!modalShow);
    }

    useEffect(() => {
        getMaterials();
    }, []);

    return (
    <React.Fragment>
        <ImageBackground
            source={require('../assets/background.png')}
            style={{
                height: 180,
                marginTop: getStatusBarHeight()
            }}>
            <Input
                placeholder="Search Material"
                value={searchKeyword}
                onChangeText={e => setSearchKeyword(e)}
                onEndEditing={() => search()}
                style={{ padding: 8, marginTop: 110 }}
            />
        </ImageBackground>
        { loading && <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', 
            padding: 8, borderBottomColor: '#e3e3e3', borderBottomWidth: 1 }}>
            <Layout style={{ flex: 1 }}>
                <Text>Loading Inventory ...</Text>
            </Layout>
            <Layout>
                <Spinner/>
            </Layout>
        </Layout> }
        <SafeAreaView>
            <ScrollView>
                { !loading && materials.length > 0 && materials.slice(0,20).map(d => <TouchableOpacity
                    onPress={() => selectMaterial(d.id)} key={d.id}>
                    <Layout 
                        style={{ flexDirection: 'row', justifyContent: 'space-between', 
                        padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3' }}>
                        <Text>{d.name}</Text>
                        <Text>Stok: {d.quantity} {d.unit}</Text>
                    </Layout>
                </TouchableOpacity>) }
            </ScrollView>
        </SafeAreaView>
        <Modal allowBackdrop={true}
            backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onBackdropPress={() => setModalShow(!modalShow)}
            visible={modalShow}>
            {renderModal()}
        </Modal>
        <Modal allowBackdrop={true}
            backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onBackdropPress={() => setSuccessPrompt(!successPrompt)}
            visible={successPrompt}>
            {renderSuccess()}
        </Modal>
        <Modal allowBackdrop={true}
            backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onBackdropPress={() => setErrorPrompt(!errorPrompt)}
            visible={errorPrompt}>
            {renderError()}
        </Modal>
    </React.Fragment>
    );
}

export default ListScreen;