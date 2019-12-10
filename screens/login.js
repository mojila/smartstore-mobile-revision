import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { newBackend, oldBackend } from '../constant/apiUrl';
import { NavigationActions, StackActions } from 'react-navigation';

export const refreshToken = async () => {
    let token = await AsyncStorage.getItem('@auth_token');

    await axios.get(`${newBackend}/refresh_token`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(async (res) => await AsyncStorage.setItem('@auth_token', res.data['new_token']))
    .catch(err => console.error(Error(err)));
};

const LoginScreen = (props) => {
    const [isError, setIsError] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('12345678');
    const [isConnect, setIsConnect] = useState(false);

    const checkLogin = async () => {
        try {
            let value = await AsyncStorage.getItem('@auth_token')

            if (value !== null) {
                props.navigation.dispatch(resetToHome);
            }
        } catch (_e) {
        }
    };

    const login = async () => {
        try {
            let value = await axios.post(`${newBackend}/login`, {
                'username': username,
                'password': password
            }).then(res => res.data);
            
            if (value !== null) {
                await AsyncStorage.setItem('@auth_token', value['token']);
                await AsyncStorage.setItem('@auth_profile', JSON.stringify(value.user));
                await checkLogin();
            }
        } catch (_e) {
            setIsError(true);
        }
    }

    const resetToHome = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })]
    });

    const checkConnection = async () => {
        await axios.get(`${oldBackend}?format=json`)
            .then(() => setIsConnect(true))
            .catch(() => setIsConnect(false));
        await axios.get(`${newBackend}/check`)
            .then(() => setIsConnect(true))
            .catch(() => setIsConnect(false));
    }

    useEffect(() => {
        checkLogin();
        checkConnection();

        return function cleanup() {
        };
    }, []);

    return (
        <Layout style={{ flex: 1, marginTop: getStatusBarHeight(), padding: 32 }}>
            <Text category="h2">Welcome!</Text>
            <Text>To Smartstore Mobile</Text>
            <Layout style={{ marginTop: 32 }}>
                <Input placeholder = "Enter Your Username" 
                    value={username}
                    onChangeText={e => setUsername(e)}
                    autoCompleteType = "username"/>
                <Input placeholder = "Enter Your Password"
                    secureTextEntry
                    value={password}
                    onChangeText={e => setPassword(e)}/>
                    {isError && <Text style={{ textAlign: 'center', marginTop: 8}}
                        status="danger">Email or Password is Incorrect.</Text>} 
                    {!isConnect && <Text style={{ textAlign: 'center', marginTop: 8}}
                        status="danger">App Not Connected to Server.</Text>} 
                <Button
                    style={{ marginTop: 16 }}
                    onPress={() => login()}
                    disabled={!isConnect}>
                    Log in
                </Button> 
            </Layout> 
        </Layout>
    ); 
}

export default LoginScreen;