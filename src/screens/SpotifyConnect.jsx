import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { getAuth, signOut } from "firebase/auth";
import app, { firestore_db } from "../../firebase";
import { collection, doc, updateDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SpotifyConnect = ({ setToken }) => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      responseType: AuthSession.ResponseType.Token,
      clientId: "f58b660788fa4f2f9391a1318a8e609c",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-top-read",
        "playlist-read-private",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-private",
        "playlist-modify-public",
      ],
      usePKCE: false,
      redirectUri: AuthSession.makeRedirectUri({
        native: "meloconnect.ansh://",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      if (access_token) {
        updateTokens(access_token);
      }
    }
  }, [response]);

  const updateTokens = async (access_token) => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const userCollections = collection(firestore_db, "users");
    const userDocRef = doc(userCollections, user.uid);
    await updateDoc(userDocRef, {
      access: access_token,
    });
    setToken(true);
  };

  const handleSignout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: 50,
        padding: 20,
        height: "100%",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <Image
        style={{ height: 255, width: 250 }}
        source={require("../assets/spotify-logo.png")}
      />
      <TouchableOpacity
        style={{ backgroundColor: "#4DED75", padding: 10, borderRadius: 7 }}
        onPress={() => promptAsync()}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            color: "black",
            fontWeight: "600",
          }}
        >
          Connect To Spotify
        </Text>
      </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default SpotifyConnect;
