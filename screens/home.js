import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Button, 
    BottomNavigation, 
    BottomNavigationTab,
    Spinner } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';

const HomeScreen = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://139.180.133.201:8000/api/materials/?format=json`)
            .then(res => {
                setMaterials(res.data);
            })
            .then(() => setLoading(false))
            .catch(err => console.log(new Error(err)));
    }, [])

    const search = (e) => {
        setLoading(true);
        setSearchKeyword(e);
        axios.get(`http://139.180.133.201:8000/api/materials/?format=json&search=${e}`)
            .then(res => setMaterials(res.data))
            .then(() => setLoading(false))
            .catch(err => console.log(new Error(err)));
    }

    return (
        <Layout style={{ flex: 1, marginTop: getStatusBarHeight() }}>
            <ImageBackground
                source={require('../assets/background.png')}
                style={{
                    height: 180
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
                    { materials.slice(0,20).map(d => <Layout key={d.id} 
                        style={{ flexDirection: 'row', justifyContent: 'space-between', 
                        padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3' }}>
                        <Text>{d.name}</Text>
                        <Text>Stok: {d.quantity} {d.unit}</Text>
                    </Layout>) }
                </ScrollView>
            </SafeAreaView>
            <BottomNavigation style={{ position: 'absolute', zIndex: 99, bottom: 0, elevation: 1 }}
                selectedIndex={selectedIndex}
                onSelect={(e) => setSelectedIndex(e)}>
                <BottomNavigationTab title='INVENTORY'/>
                <BottomNavigationTab title='PICKUP LIST'/>
                <BottomNavigationTab title='ORDER'/>
                <BottomNavigationTab title='PROFILE'/>
            </BottomNavigation>
        </Layout>
    );
}

export default HomeScreen;