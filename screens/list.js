import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Modal, Button, Icon, Avatar,
    Select    
} from 'react-native-ui-kitten';
import { ImageBackground, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { oldBackend, newBackend } from '../constant/apiUrl';
import moment from 'moment';
import empty_icon from '../assets/empty.png';

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

const ListScreen = (props) => {
    const [materials, setMaterials] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState({ id: 0, name: '' });
    const [quantity, setQuantity] = useState(1);
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [wo, setWo] = useState('');
    const [isTyping, setIsTyping] = useState(false)
    const [year, setYear] = useState(moment().format('YYYY'))
    const [day, setDay] = useState({ text: moment().format('DD') })
    const [month, setMonth] = useState({ text: moment().format('MM') })

    const search = () => {
        setLoading(true);

        return axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity&search=${searchKeyword}`)
            .then((res) => getNewMaterialAPI(res.data.results))
            .then(() => setLoading(false))
            .catch(err => {
                console.log(new Error(err));
                setLoading(false);
            });
    };

    const formatPrice = (num) => {
        return 'Rp. ' + Number(num).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    };

    const getNewMaterialAPI = (data) => {
        axios.get(`${newBackend}/material`)
            .then(res => {
                let temp_materials = data.map(d => {
                    let from_old = res.data.data.filter(x => x.id === d.id);
                    
                    if (from_old.length > 0) {
                        d.price = from_old[0].price || 0;
                        d.photo = from_old[0].photo ? { uri: from_old[0].photo } : empty_icon;
                        d.thumbnail = from_old[0].thumbnail ? { uri: from_old[0].thumbnail } : empty_icon;
                    } else {
                        d.price = 0;
                        d.photo = empty_icon;
                        d.thumbnail = empty_icon;
                    }

                    return d;
                });

                setMaterials(temp_materials);
            })
            .catch(err => {
                console.log(new Error(err));
            })
    };

    const getMaterials = () => {
        axios.get(`${oldBackend}/materials/?format=json&limit=20&ordering=-quantity`)
            .then((res) => getNewMaterialAPI(res.data.results || []))
            .then(() => setLoading(false))
            .catch(err => {
                console.log(new Error(err));
                setLoading(false);
            });
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
            'requestfor': `${year}-${month.text}-${day.text}`,
            'notes': notes
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            setModalShow(false);
        }).catch((err) => {
            console.log(err)
            setModalShow(false);
        });
    };

    const createPickup = async () => {
        let token = await AsyncStorage.getItem('@auth_token');

        console.log({
            'material_id': selectedMaterial['id'],
            'qty': quantity,
            'picked_date': `${year}-${month.text}-${day.text}`,
            'wo': wo
        })

        return axios.post(`${newBackend}/pickup`, {
            'material_id': selectedMaterial['id'],
            'qty': quantity,
            'picked_date': `${year}-${month.text}-${day.text}`,
            'wo': wo
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => setModalShow(false))
            .catch((err) => {
                console.log(err)
                setModalShow(false);
            });
    };

    const renderModal = () => (
        <Layout level="3" style={{
            width: 300,
            padding: 16,
            borderRadius: 4,
            backgroundColor: '#ffffff'
        }}>
            <ImageBackground
                source={selectedMaterial.photo}
                style={{
                    height: 120,
                    marginBottom: 8
                }}/>
            { !isTyping && <Layout>
                <Text>Code: {selectedMaterial.code}</Text>
                <Text>Material Name: {selectedMaterial.name}</Text>
                <Text>Price: {formatPrice(selectedMaterial.price)}</Text>
                <Text>Category: {selectedMaterial.category ? selectedMaterial.category.name : 'Uncategorized'}</Text>
                <Text>Stock: {selectedMaterial.quantity} {selectedMaterial.unit}</Text>
                <Text>Location: Rak {selectedMaterial.shelf_code} Box {selectedMaterial.box_code}</Text>
            </Layout> }
            <Layout style={{ marginTop: 8, flexDirection: 'row', paddingTop: 4, borderTopColor: '#e3e3e3', borderTopWidth: 1 }}>
                <Button status="control" icon={renderIconDown}
                    style={{ marginRight: 2 }} onPress={reduceQuantity}></Button>

                <Input value={quantity.toString()} keyboardType="number-pad"
                    onChangeText={e => setQuantity(Number(e))} 
                    style={{ flex: 1, marginRight: 2, marginTop: 1 }}/>
                
                <Button status="control" icon={renderIconUp} onPress={addQuantity}></Button>
            </Layout>
            <Layout style={{ marginTop: 4 }}>
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
                {quantity > selectedMaterial.quantity 
                    ? <Input label="Notes" value={notes} 
                        onBlur={() => setIsTyping(false)} 
                        onFocus={() => setIsTyping(true)} onChangeText={setNotes}/>
                    : <Input label="WO" value={wo} onChangeText={setWo}
                        onBlur={() => setIsTyping(false)} 
                        onFocus={() => setIsTyping(true)}/>}
            </Layout>
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
        console.log(material);
        setSelectedMaterial(material);
        setQuantity(1);

        return setModalShow(!modalShow);
    }

    useEffect(() => {
        getMaterials();
    }, [setLoading, setMaterials]);

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
            <ScrollView style={{ marginBottom: 16 }}>
                { !loading && materials.length > 0 && materials.slice(0,20).map(d => <TouchableOpacity
                    onPress={() => selectMaterial(d.id)} key={d.id}>
                    <Layout 
                        style={{ flexDirection: 'row', justifyContent: 'space-between', 
                        padding: 16, borderBottomWidth: 0.5, borderColor: '#e3e3e3', height: 64 }}>
                        <Layout style={{ marginRight: 8 }}>
                            <Avatar source={d.thumbnail}/>
                        </Layout>
                        <Layout style={{ flex: 1 }}>
                            <Text>{d.name.substring(0,20)}</Text>
                            <Text style={{ fontSize: 10 }}>{formatPrice(d.price)}</Text>
                        </Layout>
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