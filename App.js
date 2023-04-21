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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { storage } from "./firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "uuid";

const { height, width } = Dimensions.get("window");

export default function App() {
  const [image, setImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

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

  return (
    <View style={styles.container}>
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
              {(image && !isUploaded) && (
                <View>
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
  defaultImage: {
    height: height / 3,
    width: width / 0.5,
    resizeMode: "contain",
  },
  imageUpload: {
    height: 30,
    width: 150,
    backgroundColor: "blue",
    color: "#fff",
  },
});
