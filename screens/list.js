import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Modal } from 'react-native-ui-kitten';
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { oldBackend } from '../constant/apiUrl';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ListScreen = (props) => {
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState({ id: 0, name: '' });

    const search = async (e) => {
        setLoading(true);
        setSearchKeyword(e);
        await axios.get(`${oldBackend}/materials/?format=json&limit=20&search=${e}`)
            .then(res => {
                setMaterials(res.data.results);
                setLoading(false);
            })
            .catch(err => console.log(new Error(err)));
    };

    const getMaterials = () => {
        axios.get(`${oldBackend}/materials/?format=json&limit=20`)
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
            borderRadius: 4
        }}>
            <Text>Material Name: {selectedMaterial.name}</Text>
            <Text>Category: {selectedMaterial.category ? selectedMaterial.category.name : 'Uncategorized'}</Text>
            <Text>Stock: {selectedMaterial.quantity} {selectedMaterial.unit}</Text>
            <Text>Company Code: {selectedMaterial.company_code}</Text>
            <Text>Location: Rak {selectedMaterial.shelf_code} Box {selectedMaterial.box_code}</Text>
        </Layout>
    );

    const selectMaterial = async (id) => {
        let material = materials.filter(x => x.id === id)[0];
        setSelectedMaterial(material);
        setModalShow(!modalShow);
    }

    useEffect(getMaterials, []);

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