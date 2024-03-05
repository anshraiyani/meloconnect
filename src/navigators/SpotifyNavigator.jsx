import React, { useEffect, useState } from "react";
import SpotifyConnect from "../screens/SpotifyConnect";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import Profile from "../screens/Profile";
import Splash from "../screens/Splash";
import MainNavigator from "./MainNavigator";

const SpotifyNavigator = ({ user }) => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAccessToken = async () => {
    const userCollections = collection(firestore_db, "users");
    const userDocRef = doc(userCollections, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const { access_token } = userDocSnapshot.data();

      if (access_token) {
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
      {loading ? (
        <Splash />
      ) : token ? (
        <MainNavigator />
      ) : (
        <SpotifyConnect setToken={setToken} />
      )}
    </>
  );
};

export default SpotifyNavigator;
