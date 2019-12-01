import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Spinner, Button } from 'react-native-ui-kitten';
import { AsyncStorage } from 'react-native';
import BottomTab from '../component/bottomTab';

const ProfileScreen = (props) => {
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth_token');
            await props.screenProps.rootNavigation.navigate('Login');
        } catch(_e) {

        }
    };

    return (
    <React.Fragment>
        <Layout style={{ padding: 16 }}>
            <Button
                status="danger"
                onPress={() => logout()}>
                Logout
            </Button>
        </Layout>
        <BottomTab indexTab={3} navigation={props.navigation}/>
    </React.Fragment>
    );
}

export default ProfileScreen;