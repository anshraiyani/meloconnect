import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOtupwMUJOrqfSekj_90_tUXB2ZX0qF8s",
  authDomain: "meloconnect-auth.firebaseapp.com",
  projectId: "meloconnect-auth",
  storageBucket: "meloconnect-auth.appspot.com",
  messagingSenderId: "911424142612",
  appId: "1:911424142612:web:8ccb138795db7e44335601",
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export default app;
export const firestore_db=getFirestore(app);