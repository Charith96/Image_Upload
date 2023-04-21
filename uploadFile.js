import { putFile, getDownloadURL } from "@firebase/storage";
import { Platform } from "react-native";

const uploadImage = async (uri, filename) => {
  const storageRef = storage.ref();
  const imageRef = storageRef.child(`images/${filename}`);

  const response = await fetch(uri);
  const blob = await response.blob();

  await putFile(imageRef, blob);

  // Get the URL of the uploaded image
  const downloadURL = await getDownloadURL(imageRef);

  return downloadURL;
};
