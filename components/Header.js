import React from "react";
import {Text, View, StyleSheet} from "react-native";


const Header = ({heading}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{heading}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0c6ffa",
        height: 45,
        padding: 7,
        paddingLeft: 20,
        borderBottomWidth: 2,
        borderColor: "#045bd4",
    },
    name: {
        fontSize: 20,
        // fontFamily: 
    }
});

export default Header;