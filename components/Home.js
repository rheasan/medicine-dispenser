import React from "react";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";



const Home = ({navigation}) => {
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate("Medicine List")} style={styles.medicineListContainer}>
                <Text>View Medicine List</Text>
            </TouchableOpacity>
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
    medicineListContainer: {
        backgroundColor: "#000",
        padding: 20,
        borderRadius: 7,
    }
});

export default Home;