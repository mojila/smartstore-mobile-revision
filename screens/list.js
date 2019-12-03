import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Modal } from 'react-native-ui-kitten';
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { oldBackend } from '../constant/apiUrl';

const ListScreen = (props) => {
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${oldBackend}/materials/?format=json&limit=20`)
            .then(res => {
                setMaterials(res.data.results);
                setLoading(false);
            })
            .catch(err => console.log(new Error(err)));
    }, []);

    const search = (e) => {
        setLoading(true);
        setSearchKeyword(e);
        axios.get(`${oldBackend}/materials/?format=json&limit=20&search=${e}`)
            .then(res => {
                setMaterials(res.data.results);
                setLoading(false);
            })
            .catch(err => console.log(new Error(err)));
    };

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
                { (materials.length > 0) && materials.slice(0,20).map(d => <Layout key={d.id} 
                    style={{ flexDirection: 'row', justifyContent: 'space-between', 
                    padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3' }}>
                    <Text>{d.name}</Text>
                    <Text>Stok: {d.quantity} {d.unit}</Text>
                </Layout>) }
            </ScrollView>
        </SafeAreaView>
    </React.Fragment>
    );
}

export default ListScreen;