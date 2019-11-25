import React, { useState } from 'react';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Input, Text, Button } from 'react-native-ui-kitten';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';

const ApplicationContent = (props) => {
    return (
        <Layout style={{ flex: 1, marginTop: getStatusBarHeight() }}>
            <ImageBackground
                source={require('../assets/background.png')}
                style={{
                    height: 180
                }}>
                <Input
                    placeholder="Search Material"
                    style={{ padding: 8, marginTop: 110 }}
                />
            </ImageBackground>
            <SafeAreaView>
                <ScrollView>
                    
                </ScrollView>
            </SafeAreaView>
        </Layout>
    );
}

const HomeScreen = (props) => (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <ApplicationContent navigation={props.navigation}/>
    </ApplicationProvider>
);

export default HomeScreen;