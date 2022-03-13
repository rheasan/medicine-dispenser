

import React from 'react';
import {StyleSheet, View, Text} from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MedicineList from './components/MedicineList';
import Home from './components/Home';



const Drawer = createDrawerNavigator();
const App = () => {

    return (
        // <SafeAreaView style={backgroundStyle}>
        //     <MedicineList />
        // </SafeAreaView>0
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="Medicine List" component={MedicineList} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
