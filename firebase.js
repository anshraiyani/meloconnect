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

// const firebaseConfig = {
//   apiKey: "AIzaSyBq0hk3u1BMXSdRF44N2os-Vp-zyNAIs9c",
//   authDomain: "meloconnect-3559f.firebaseapp.com",
//   projectId: "meloconnect-3559f",
//   storageBucket: "meloconnect-3559f.appspot.com",
//   messagingSenderId: "208485748869",
//   appId: "1:208485748869:web:cfeeca9b23c65c221fd9ec"
// };

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export default app;
export const firestore_db=getFirestore(app);