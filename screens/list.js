import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Modal, Button, Icon } from 'react-native-ui-kitten';
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { oldBackend } from '../constant/apiUrl';

const ListScreen = (props) => {
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState({ id: 0, name: '' });
    const [quantity, setQuantity] = useState(1);

    const search = async (e) => {
        setLoading(true);
        setSearchKeyword(e);
        await axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity&search=${e}`)
            .then(res => {
                setMaterials(res.data.results);
                setLoading(false);
            })
            .catch(err => console.log(new Error(err)));
    };

    const getMaterials = () => {
        axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity`)
            .then(res => {
                setMaterials(res.data.results);
                setLoading(false);
            })
            .catch(err => console.log(new Error(err)));
    };

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
                    style={{ marginRight: 2 }}></Button>

                <Input value={quantity.toString()} keyboardType="number-pad"
                    onChangeText={e => setQuantity(Number(e))} 
                    style={{ flex: 1, marginRight: 2, marginTop: 1 }}/>
                
                <Button status="control" icon={renderIconUp}></Button>
            </Layout>
            <Layout style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between',  }}>
                <Button status="success" disabled={quantity <= selectedMaterial.quantity} style={{ flex: 1, marginRight: 2 }}>Order</Button>
                <Button status="primary" disabled={quantity > selectedMaterial.quantity} style={{ flex: 1 }}>Pickup</Button>
            </Layout>
        </Layout>
    );

    const renderIconUp = (style) => (<Icon name="arrow-ios-upward-outline" {...style}/>)
    const renderIconDown = (style) => (<Icon name="arrow-ios-downward-outline" {...style}/>)

    const selectMaterial = async (id) => {
        let material = materials.filter(x => x.id === id)[0];
        setSelectedMaterial(material);
        setModalShow(!modalShow);
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
                onChangeText={e => search(e)}
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
                { (materials.length > 0) && materials.slice(0,20).map(d => <TouchableOpacity
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
    </React.Fragment>
    );
}

export default ListScreen;