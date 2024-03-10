import app, { firestore_db } from "../../firebase";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Clipboard from "expo-clipboard";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "../contexts/userContext";

const Profile = () => {
  const { userState, dispatchUser } = useUser();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userState.uid);
  };

  const getUser = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const userCollections = collection(firestore_db, "users");
    const userDocRef = doc(userCollections, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const {
        uid,
        email,
        spotify_display_name,
        profile_image,
        topArtists,
        friends,
        friendRequests,
        sentFriendRequests,
      } = userDocSnapshot.data();
      dispatchUser({
        type: "UPDATE_USER",
        payload: {
          uid,
          email,
          spotify_display_name,
          profile_image,
          topArtists,
          friends,
          friendRequests,
          sentFriendRequests,
        },
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

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

  const handleSignout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {userState.email && (
        <SafeAreaView
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#101010",
            padding: 10,
          }}
        >
          <View
            style={{
              paddingHorizontal: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 35, fontFamily: "HeroBd" }}
            >
              PROFILE
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#8a2424",
                padding: 5,
                borderRadius: 10,
              }}
              onPress={handleSignout}
            >
              <Text style={{ color: "white", fontFamily: "HeroBd" }}>
                LOG OUT
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#404040", height: 2 }}></View>
          <View style={{ width: "100%", height: "100%" }}>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "100%",
              }}
            >
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  borderColor: "#d24dff",
                  borderWidth: 2,
                }}
                source={{ uri: userState.profile_image }}
              />
              <View style={{ gap: 5, flexWrap: "wrap", width: "100%" }}>
                <Text
                  style={{ color: "white", fontSize: 25, fontFamily: "HeroRg" }}
                >
                  {userState.spotify_display_name}
                </Text>
                <View style={{ flexDirection: "row",alignItems:'center' }}>
                  <Text
                    style={{
                      color: "#909090",
                      fontSize: 17,
                      fontFamily: "HeroRg",
                      flex: 1,
                      flexWrap:'wrap'
                    }}
                  >
                    {userState.email}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#d24dff",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                    width: 120,
                  }}
                >
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontFamily: "HeroBd",
                      }}
                    >
                      COPY ID
                    </Text>
                    <AntDesign name="copy1" size={17} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ padding: 5, marginVertical: 10 }}>
              <Text
                style={{ color: "white", fontFamily: "HeroBd", fontSize: 25 }}
              >
                Top Artists
              </Text>
              <ScrollView
                contentContainerStyle={{
                  gap: 10,
                  paddingHorizontal: 50,
                  paddingBottom: 200,
                  paddingTop: 10,
                }}
              >
                {userState.topArtists.map((el, idx) => {
                  return (
                    <View
                      key={el.artist_name}
                      style={{
                        backgroundColor: "#282828",
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "HeroBd",
                          color: "#d24dff",
                          fontSize: 20,
                        }}
                      >
                        {idx + 1}
                      </Text>
                      <Image
                        source={{ uri: el.image_url }}
                        style={{ height: 50, width: 50, borderRadius: 60 }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontFamily: "HeroBd",
                        }}
                      >
                        {el.artist_name}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default Profile;
