import {
  database,
  collection,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "./firebase.config";

// Firestore collection
const plantCollection = collection(database, "Plants");

// Get specific plant from Firestore
const getSpecificPlant = async (plantName) => {
  try {
    console.log("plantName ", plantName);
    const queryDocs = query(plantCollection, where("name", "==", plantName));
    const querySnapshot = await getDocs(queryDocs);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    alert(error);
  }
};

export { getSpecificPlant };
