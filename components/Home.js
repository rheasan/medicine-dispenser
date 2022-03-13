import React from "react";
import {View, StyleSheet, Text} from "react-native";


const Home = () => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.heading}>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#121414",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: 30
    }
});

export default Home;