import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { newBackend, oldBackend } from '../constant/apiUrl';
import { NavigationActions, StackActions } from 'react-navigation';

const LoginScreen = (props) => {
    const [isError, setIsError] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isConnect, setIsConnect] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const checkLogin = async () => {
        let value = await AsyncStorage.getItem('@auth_token');

        if (value !== null) {
            return props.navigation.dispatch(resetToHome);
        }
        
        return setShowInfo(true);
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

    const checkConnection = () => {
        axios.get(`${oldBackend}?format=json`)
            .then(() => setIsConnect(true))
            .catch(() => setIsConnect(false));
        axios.get(`${newBackend}/check`)
            .then(() => setIsConnect(true))
            .catch(() => setIsConnect(false));
    }

    useEffect(() => {
        checkConnection();
        checkLogin();

        return () => {};
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
                    {showInfo && <Text style={{ textAlign: 'center', marginTop: 8}}
                        status="info">Please Login First.</Text>} 
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