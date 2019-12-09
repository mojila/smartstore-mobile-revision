import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Text } from 'react-native-ui-kitten';
import { AsyncStorage } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl'

const ProfileScreen = (props) => {
    const [userProfile, setUserProfile] = useState({ first_name: '', last_name: '', employee_id: '' });

    const getProfile = async () => {
        let profile = await AsyncStorage.getItem('@auth_profile');

        if (profile !== null) {
            setUserProfile(JSON.parse(profile));
        }
    }
    
    useEffect(() => {
        getProfile();
    }, []);

    const logout = async () => {
        try {
            let token = await AsyncStorage.getItem('@auth_token');

            await Axios.post(`${newBackend}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch(err => console.error(Error(err)));

            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@auth_profile');
            await props.screenProps.rootNavigation.navigate('Login');
        } catch(e) {
            console.error(Error(e));
        }
    };

    return (
        <Layout style={{ padding: 16, marginTop: getStatusBarHeight() }}>
            <Layout style={{ alignItems: 'center', marginBottom: 16 }}>
                <Avatar size="giant" source={require('../assets/person.png')}
                    style={{ borderWidth: 1, borderColor: '#e3e3e3' }}/>
                    <Text category="h4" style={{ marginTop: 8 }}>{`${userProfile.first_name} ${userProfile.last_name}`}</Text>
            </Layout>
            <Button
                status="danger"
                onPress={() => logout()}>
                Logout
            </Button>
        </Layout>
    );
}

export default ProfileScreen;