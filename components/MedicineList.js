import React from "react";
import {View, Text, ScrollView, StyleSheet, Button, TouchableHighlight, TextInput, TouchableOpacity} from "react-native";
import { useState , useEffect} from "react";
import DatePicker from 'react-native-date-picker'
import firestoreHandler from "../lib/firestoreHandler";

const MedicineList = () => {
    let [medicineList, setMedicineList] = useState([]);
    let [showForm, setShowForm] = useState(false);
    let [showMedicines, setShowMedicines] = useState(true);
    let [medicineName, setMedicineName] = useState('');
    let [medicineTime, setMedicineTime] = useState(new Date());
    let [open, setOpen] = useState(false);


    const initialize = async ()=>{
        const medicineData = await firestoreHandler.getAllDocs();
        setMedicineList(medicineData);
    }

    useEffect(()=>{
        initialize();
    }, []);


    //mode = 1 => add new key to state
    //mode = 0 => remove key form state
    const updateMedicine = async (key, mode) => {
        if(mode === 0){
            const oldList = [...medicineList];
            let newList = oldList.filter((elem)=>(elem.name != key.name || elem.time != key.time));
            setMedicineList(newList);
            await firestoreHandler.deleteDoc(key);
        }
        if(mode == 1){
            let oldList = [...medicineList];
            if(key.name != ''){
                oldList.push(key);
                setMedicineList(oldList);
                showMedicineForm(showForm);
                await firestoreHandler.addDoc(key);
            }
            else{
                showMedicineForm(!showForm);
            }
        }
    }
    
    //!should probably find a better way of doing this
    const showMedicineForm = (state) => {
        setShowForm(!state);
        setShowMedicines(state);
    }
    
    const getTime = (date) => {
        return `${date.getHours()}:${String(date.getMinutes()).length == 1 ? "0"+ String(date.getMinutes()) : date.getMinutes()}`;
    }

    return (
        <>
        <ScrollView style={showMedicines ? styles.visibleMainContainer: styles.invisibleMainContainer}>
            {/* <Header heading="Medicines"/> */}
            {medicineList?.map((elem, index) => {
                return (
                    <View key={index} style={styles.dataContainer}>
                        <View style={styles.medicineData}>
                            <Text style={styles.text}>{index+1}. {elem.name}</Text>
                            <Text style={styles.text}>Time: {getTime(new Date(elem.time))}</Text>
                        </View>
                        {/* <Button title="-" style={styles.delButton} onPress={()=>updateMedicine(elem.name)} color="#992012"/> */}
                        <TouchableHighlight onPress={()=>updateMedicine({name:elem.name, time: elem.time},0)}>
                            <View style={styles.delButton}>
                                <Text style={styles.delButtonText}>Remove</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            })}
            <View style={styles.dataContainer}>
                <TouchableHighlight style={styles.addMedicine} onPress={()=>showMedicineForm(showForm)}>
                    <Text style={styles.addMedicineText}>Add new medicine</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
        <View style={showForm ? styles.visibleMedicineForm : styles.invisibleMedicineForm}>
            <TextInput value={medicineName} onChangeText={setMedicineName} placeholder="Medicine Name" style={styles.input}></TextInput>
            <TouchableHighlight style={styles.showTimePicker} onPress={()=>setOpen(true)}>
                <Text style={styles.addMedicineText}>Select Time</Text>
            </TouchableHighlight>
                <DatePicker
                modal
                open={open}
                date={medicineTime}
                onConfirm={(date) => {
                    setOpen(false)
                    setMedicineTime(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
                mode="time"
            />
            <Text style={styles.showSelectedTime}>Current Selected Time: {getTime(medicineTime)}</Text>
            <TouchableOpacity style={styles.addMedicine}> 
                <Text style={styles.addMedicineText} onPress={()=> {updateMedicine({name: medicineName, time: medicineTime}, 1); setMedicineName('')}}>Add Medicine</Text>
            </TouchableOpacity>
        </View>
        
        </>
    );
}


const styles = StyleSheet.create({
    visibleMainContainer: {
        flex: 1,
        backgroundColor: "#121414",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
    },
    invisibleMainContainer: {
        display: 'none',
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
    },
    addButton: {

    },
    addMedicine:{
        fontSize: 20,
        padding: 10,
        margin: 15,
        // height: 35,
        width: 150,
        backgroundColor: "#3df700",
        borderRadius: 7,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    addMedicineText: {
        fontSize: 15,
        color: "#000",
        margin: "auto",
    },
    visibleMedicineForm: {
        flex: 1,
        backgroundColor: "#121414",
    },
    invisibleMedicineForm: {
        flex: 0,
        display: "none",
    },
    input: {
        borderWidth: 2,
        borderColor: "#333",
        padding: 10,
        margin: 20,
        borderRadius: 5,
        fontSize: 18,
    },
    timeOpacity: {
        color: '#85AEBE',
        borderWidth: 1,
        borderColor: '#2f5b78',
        height: 40,
        width: 80,
        margin: 20,
        padding: 10,
        marginBottom: 2,
    },
    showSelectedTime: {
        margin: 20,
        fontSize: 18,
        marginTop: 2,
    },
    showTimePicker: {
        fontSize: 20,
        padding: 10,
        margin: 15,
        borderRadius: 7,
        width: 150,
        backgroundColor: "#3df700",
    },
});
const test = [{"name": "A", "time": new Date("2022-04-13T13:16:44.000Z")}, {"name": "B", "time": new Date("2022-04-13T14:16:44.000Z")}, {"name": "C", "time": new Date("2022-04-13T15:16:44.000Z")}]
export default MedicineList;