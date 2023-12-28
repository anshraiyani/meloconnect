import React, { useEffect, useState } from "react";
import SpotifyConnect from "../screens/SpotifyConnect";
import Home from "../screens/Home";
import { collection, doc, getDoc } from "firebase/firestore";
import { Text } from "react-native";
import { firestore_db } from "../../firebase";

const SpotifyNavigator = ({ user }) => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAccessToken = async () => {
    const userCollections = collection(firestore_db, "users");
    const userDocRef = doc(userCollections, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const {access} = userDocSnapshot.data();

      if (access) {
        setToken(true);
      } else {
        setToken(false);
      }
    } else {
      console.log("User document not found.");
    }
    setLoading(false);
  };
  useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <>
      {loading ? <Text>Loading</Text> : token ? <Home /> : <SpotifyConnect setToken={setToken}/>}
    </>
  );
};

export default SpotifyNavigator;
