import app, { firestore_db } from "../../firebase";
import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import axios from "axios";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

const Home = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

  const getAccessToken = async () => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const userCollections = collection(firestore_db, "users");
      const userDocRef = doc(userCollections, user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const { access } = userDocSnapshot.data();
        if (access) {
          setAccessToken(access);
          getUserProfile(access);
          getUserTopArtists(access);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAccessToken();
  }, [accessToken]);

  const getUserProfile = async (accessToken) => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userProfile = response.data;
      setProfile(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error.response.data);
      throw error;
    }
  };

  const getUserTopArtists = async (accessToken) => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const artists = response.data.items;
      setTopArtists(artists);
    } catch (error) {
      console.error("Error fetching user profile:", error.response.data);
      throw error;
    }
  };

  const handleSignout = async () => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      const userCollections = collection(firestore_db, "users");
      const userDocRef = doc(userCollections, user.uid);
      await updateDoc(userDocRef, {
        access: "",
      });
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text style={{ color: "black" }}>{profile && profile.display_name}</Text>
      <Text style={{ color: "black" }}>{profile && profile.email}</Text>
      {profile && (
        <Image
          style={{ height: 50, width: 50 }}
          source={{ uri: profile.images[1].url }}
        />
      )}
      {topArtists &&
          topArtists.map((item, id) => <Text key={id}>{item.name}</Text>)
        }
      <TouchableOpacity
        style={{ backgroundColor: "#4DED75", padding: 10, borderRadius: 7 }}
        onPress={() => handleSignout()}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            color: "black",
            fontWeight: "600",
          }}
        >
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
