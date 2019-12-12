import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { Layout, Text, Spinner, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import PickupItem from '../component/pickupItem';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl';

const PickupListScreen = (props) => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPickups = async () => {
        setLoading(true);
        let token = await AsyncStorage.getItem('@auth_token');
        
        if (token !== null) {
            Axios.get(`${newBackend}/pickup`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => setPickups(res.data['data']))
            .then(() => setLoading(false))
            .catch(err => console.warn(err));
        }
    }

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
                {!loading && pickups.length > 0 && pickups.map((d, i) => <TouchableHighlight key={i}>
                    <PickupItem name={d.material.name} quantity={d.qty} unit={d.material.unit}/>
                </TouchableHighlight>)}
            </ScrollView>
        </SafeAreaView>
    </React.Fragment>);
}

export default PickupListScreen;