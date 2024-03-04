import app, { firestore_db } from "../../firebase";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import axios from "axios";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
const Profile = () => {
  const [spotifyUser, setSpotifyUser] = useState(null);

  const getUser = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const userCollections = collection(firestore_db, "users");
    const userDocRef = doc(userCollections, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      setSpotifyUser(userDocSnapshot.data());
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSignout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      {spotifyUser && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: 50,
          }}
        >
          <Text>{spotifyUser.spotify_display_name}</Text>
          <Text>{spotifyUser.email}</Text>
          <Image
            style={{ height: 50, width: 50 }}
            source={{ uri: spotifyUser.profile_image }}
          />
          {spotifyUser.topArtists.map((el) => (
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 6 }}
              key={el.artist_name}
            >
              <Image
                style={{ height: 40, width: 40 }}
                source={{ uri: el.image_url }}
              />
              <Text>{el.artist_name}</Text>
            </View>
          ))}
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
      )}
    </ScrollView>
  );
};

export default Profile;
