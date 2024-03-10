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
import axios from "axios";
import { collection, doc, updateDoc } from "firebase/firestore";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SpotifyConnect = ({ setToken }) => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      responseType: AuthSession.ResponseType.Token,
      clientId: "ace97ee23e9d4d048169cc1b28e1f949",
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
      // redirectUri: "exp://localhost:8081",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response);
      const { access_token } = response.params;
      if (access_token) {
        updateTokens(access_token);
      }
    }
  }, [response]);

  const updateTokens = async (access_token) => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const userProfile = response.data;
      console.log(userProfile);

      const artist_response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20&offset=1",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const artists = artist_response.data.items;
      const topArtists = artists.map((el) => {
        return {
          artist_name: el.name,
          image_url: el.images[0].url,
        };
      });

      const auth = getAuth(app);
      const user = auth.currentUser;
      const userCollections = collection(firestore_db, "users");
      const userDocRef = doc(userCollections, user.uid);
      await updateDoc(userDocRef, {
        uid: user.uid,
        display_name: user.displayName,
        email: user.email,
        spotify_display_name: userProfile.display_name,
        access_token: access_token,
        profile_image: userProfile.images[1].url,
        topArtists: topArtists,
        friends: [],
        friendRequests: [],
        sentFriendRequests: [],
      });
      setToken(true);
    } catch (error) {
      console.error("Error fetching user profile:", error.response.data);
      throw error;
    }
  };

  const handleSignout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        paddingTop: 50,
        padding: 20,
        height: "100%",
        backgroundColor: "black",
        alignItems: "center",
      }}
    >
      <View style={{ marginBottom: 60 }}>
        <Text style={{ color: "white", fontFamily: "HeroBd", fontSize: 28 }}>
          Before You Continue
        </Text>
      </View>
      <View style={{ gap: 50 }}>
        <Image
          style={{ height: 255, width: 250 }}
          source={require("../assets/spotify-logo.png")}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#4DED75",
            padding: 10,
            borderRadius: 7,
            alignItems: "center",
          }}
          onPress={() => promptAsync()}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              color: "black",
              fontFamily: "HeroBd",
            }}
          >
            Connect To Spotify
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SpotifyConnect;
