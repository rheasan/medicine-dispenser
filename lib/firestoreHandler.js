import firestore from "@react-native-firebase/firestore";


const FirestoreHandler = () => {

    const _medicine_collection = firestore().collection('medicine-list');


    
    const getAllDocs = () =>{
        const medicineData = _medicine_collection.get().then((collection)=>{
            return collection.docs.map(doc=>doc.data())
        })
        .then((medicineData)=>{
            return medicineData.map((obj)=>{
                return {name: obj.name, time: new Date(obj.time)};
            })
        })
        .catch((err)=>{throw err});
        return medicineData;
    }
    
    const deleteDoc = async (medicine) => {
        await _medicine_collection.doc(medicine.name).delete();
    }
    
    
    const addDoc = async (medicine) => {
        await _medicine_collection.doc(medicine.name)
        .set({name: medicine.name, time: medicine.time.toString()});
    }
    
    
    //for testing
    const clearCollection = async (medicineData) => {
        await medicineData.forEach(async (medicine)=>{
            await _medicine_collection.doc(medicine.name)
            .delete()
            .then(()=>{
                console.log("existing ddoc deleted", medicine);
            });
        });
        console.log("cleared all data");
    }
    const writeData = async (medicineData) => {
        await medicineData.forEach(async (medicine)=>{
            await _medicine_collection.doc(medicine.name)
            .set({name: medicine.name, time: medicine.time.toString()})
            .then(()=>{
                console.log("new doc created", medicine);
            });
        });
        console.log("wrote all data");
    }


    
    return { getAllDocs, deleteDoc, addDoc};
}

const firestoreHandler = FirestoreHandler();

export default firestoreHandler;