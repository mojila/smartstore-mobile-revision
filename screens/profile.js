import React from 'react';
import { Layout, Button } from 'react-native-ui-kitten';
import { AsyncStorage } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Axios from 'axios';
import { newBackend } from '../constant/apiUrl'
import { NavigationActions } from 'react-navigation';

const ProfileScreen = (props) => {

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
            <Button
                status="danger"
                onPress={() => logout()}>
                Logout
            </Button>
        </Layout>
    );
}

export default ProfileScreen;