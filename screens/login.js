import React, { useState } from 'react';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Input, Text, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const ApplicationContent = (props) => {
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        if (email === 'admin@smartstore.com' && password === '123456') {
            let user = {
                name: 'Admin',
                role: 'stockeeper',
            };

            AsyncStorage.setItem('user', JSON.stringify(user));
            return props.navigation.navigate('Login');
        }

        return setIsError(true);
    };

    return (
        <Layout style={{ flex: 1, marginTop: getStatusBarHeight(), padding: 32 }}>
            <Text category="h2">Welcome!</Text>
            <Text>To Smartstore Mobile</Text>
            <Layout style={{ marginTop: 32 }}>
                <Input placeholder = "Enter Your Email" 
                    value={email}
                    onChangeText={e => setEmail(e)}
                    autoCompleteType = "email"/>
                <Input placeholder = "Enter Your Password"
                    secureTextEntry
                    value={password}
                    onChangeText={e => setPassword(e)}/>
                    {isError && <Text style={{ textAlign: 'center', marginTop: 8}}
                        status="danger">Email or Password is Incorrect.</Text>} 
                <Button
                    style={{ marginTop: 16 }}>
                    Log in
                </Button> 
            </Layout> 
        </Layout>
    ); 
}
  
const LoginScreen = (props) => (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <ApplicationContent navigation={props.navigation}/>
    </ApplicationProvider>
);

export default LoginScreen;