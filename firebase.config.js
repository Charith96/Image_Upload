// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfVX-j5Yt8y_XwqxKtI_v2txNwTm5r3d8",
  authDomain: "imageuploader-acd25.firebaseapp.com",
  projectId: "imageuploader-acd25",
  storageBucket: "imageuploader-acd25.appspot.com",
  messagingSenderId: "280295674831",
  appId: "1:280295674831:web:275427fff7a0fa25e6f8ba",
  measurementId: "G-GL83VTHTLK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
