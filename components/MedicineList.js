import React from "react";
import {View, Text, ScrollView, StyleSheet, Button, TouchableHighlight} from "react-native";
import { useState } from "react";

import Header from "./Header";



const MedicineList = () => {
    let [medicineList, setMedicineList] = useState(testData);

    const updateMedicine = (key) => {
        const oldList = medicineList;
        let newList = oldList.filter((elem)=>(elem.name != key));
        setMedicineList(newList);
        //console.log(key);
    }



    return (
        <ScrollView style={styles.mainContainer}>
            <Header heading="Medicines"/>
            {medicineList.map((elem, index) => {
                return (
                    <View key={index} style={styles.dataContainer}>
                        <View style={styles.medicineData}>
                            <Text style={styles.text}>{index+1}. {elem.name}</Text>
                            <Text style={styles.text}>Time: {elem.time}</Text>
                        </View>
                        {/* <Button title="-" style={styles.delButton} onPress={()=>updateMedicine(elem.name)} color="#992012"/> */}
                        <TouchableHighlight onPress={()=>updateMedicine(elem.name)}>
                            <View style={styles.delButton}>
                                <Text style={styles.delButtonText}>Remove</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            })}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#121414",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
    },
    dataContainer: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#333",
        borderStyle: "solid",
        justifyContent: "space-between",
        alignItems: "center",
        // width: "100%",
        backgroundColor: "#181a1b",
        margin: 5,
        borderRadius: 7,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 15,
        color: "#fff",
    },
    medicineData: {
        display: "flex",
        flexDirection: "column",
        margin: 10,
    },
    delButton: {
        fontSize: 20,
        padding: 10,
        margin: 15,
        // height: 35,
        // width: 35,
        backgroundColor: "#911406",
        borderRadius: 7,
    },
    delButtonText: {
        fontSize: 10,
        color: "#fff",
    }
});

const testData = [{name: "A", time: "12:00"}, {name: "B", time: "18:00"}, {name: "C", time: "20:00"}];

export default MedicineList;