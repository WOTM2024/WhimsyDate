// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { FIREBASE_APIKEY } from "@env";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: "whimsydate.firebaseapp.com",
  projectId: "whimsydate",
  storageBucket: "whimsydate.appspot.com",
  messagingSenderId: "200007402057",
  appId: "1:200007402057:web:b418c2570ebdabaa9b7598",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
