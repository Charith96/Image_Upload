import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { storage } from "./firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getSpecificPlant } from "./backendControllers";

const { height, width } = Dimensions.get("window");

export default function App() {
  const [image, setImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [data, setData] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadImgURl = await ImageUpload(result.assets[0].uri);
      if (uploadImgURl) {
        setIsUploaded(false);
        console.log("URL ", uploadImgURl);
        setImage(uploadImgURl);
      }
    } else {
      setImage("");
    }
  };

  const ImageUpload = async (uri) => {
    setIsUploaded(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();

      return await getDownloadURL(storageRef);
    } catch (error) {
      Alert(`Error ${error}`);
    }
  };

  const getPlantDetails = async (plantName) => {
    try {
      if (plantName) {
        const matchPlant = await getSpecificPlant(plantName);
        console.log(matchPlant);
        if (matchPlant.length > 0) {
          setData(matchPlant);
          setImage(matchPlant[0]?.image);
        } else {
          Alert.alert(
            "Info",
            "No result found for the given input!",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }
      } else {
        Alert.alert(
          "Error",
          "No plant name specified!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `${error}`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  {
    console.log(data);
  }

  const clearInput = () => {
    setPlantName("");
    setData("");
    setImage("");
  };
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <TextInput
          value={plantName}
          onChangeText={setPlantName}
          style={styles.textInput}
          placeholder="Plant name"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => getPlantDetails(plantName)}
        >
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearText} onPress={clearInput}>
          <Text>❌</Text>
        </TouchableOpacity>
      </View>
      {data.length > 0 && (
        <View style={styles.resultView}>
          <View style={styles.textRow}>
            <Text style={styles.nameText}>Name:</Text>
            <Text style={styles.descriptionText}>{data[0]?.name}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.nameText}>Description:</Text>
            <Text style={styles.descriptionText}>{data[0]?.description}</Text>
          </View>
        </View>
      )}
      <View>
        <TouchableOpacity style={styles.accidentImage} onPress={pickImage}>
          {!image && !isUploaded ? (
            <>
              <FontAwesome name="image" size={300} color="gray" />
              {!isUploaded && (
                <Text style={{ textAlign: "center" }}>Add Image</Text>
              )}
            </>
          ) : isUploaded ? (
            <>
              <View>
                <ActivityIndicator size={"large"} />
              </View>
            </>
          ) : (
            <>
              {image && !isUploaded && (
                <View style={styles.imageView}>
                  <Image source={{ uri: image }} style={styles.defaultImage} />
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    marginTop: 20,
  },
  defaultImage: {
    height: height / 3,
    width: width / 1.1,
    resizeMode: "contain",
    borderRadius: 10,
    elevation: 10,
  },
  imageUpload: {
    height: 30,
    width: 150,
    backgroundColor: "blue",
    color: "#fff",
  },
  textView: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textInput: {
    paddingLeft: 10,
    width: 280,
    height: 30,
    fontSize: 14,
    borderColor: "#eeeeee",
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#bcbcbc",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 5,
  },
  searchButton: {
    height: 30,
    width: 60,
    backgroundColor: "#43aa8b",
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
  },
  clearText: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    width: width / 5,
  },
  descriptionText: {
    width: width / 1.5,
    textAlign: "justify",
  },
  resultView: {},
});
