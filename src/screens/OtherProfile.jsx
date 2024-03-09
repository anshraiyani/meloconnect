import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import app, { firestore_db } from "../../firebase";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useUser } from "../contexts/userContext";
import { getAuth } from "firebase/auth";

const OtherProfile = ({ navigation, route }) => {
  const other_uid = route.params["other_uid"];
  const similar = route.params["similar"];
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const { userState, dispatchUser } = useUser();
  const [btnLoading, setBtnLoading] = useState(false);

  function getColorByNumber(number) {
    if (number >= 70 && number <= 100) {
      return "green";
    } else if (number >= 50 && number < 70) {
      return "yellow";
    } else if (number >= 30 && number < 50) {
      return "orange";
    } else if (number >= 0 && number < 30) {
      return "red";
    } else {
      // Handle cases where the number is outside the specified ranges
      return "unknown";
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore_db, "users", other_uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
      } else {
        console.log("not found");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSendRequest = async (sender_uid, receiver_uid) => {
    setBtnLoading(true);
    try {
      const userDocRefOther = doc(firestore_db, "users", receiver_uid);
      const userDocRef = doc(firestore_db, "users", sender_uid);
      await updateDoc(userDocRefOther, {
        friendRequests: arrayUnion(sender_uid),
      });
      await updateDoc(userDocRef, {
        sentFriendRequests: arrayUnion(receiver_uid),
      });
      const sentRequest = [...userState.sentFriendRequests];
      sentRequest.push(receiver_uid);
      dispatchUser({
        type: "UPDATE_SENT_FRIEND_REQUESTS",
        payload: sentRequest,
      });
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.error("Error adding send request:", error);
      throw error;
    }
  };

  const handleAcceptRequest = async (sender_uid, receiver_uid) => {
    setBtnLoading(true);
    try {
      const userDocRefOther = doc(firestore_db, "users", receiver_uid);
      const userDocRef = doc(firestore_db, "users", sender_uid);
      await updateDoc(userDocRefOther, {
        friends: arrayUnion(sender_uid),
        sentFriendRequests: arrayRemove(sender_uid),
      });
      await updateDoc(userDocRef, {
        friends: arrayUnion(receiver_uid),
        friendRequests: arrayRemove(receiver_uid),
      });
      let sentRequest = [...userState.sentFriendRequests];
      const friends = [...userState.friends];
      friends.push(receiver_uid);
      sentRequest = sentRequest.filter((x) => x.uid !== receiver_uid);
      dispatchUser({
        type: "UPDATE_FRIENDS",
        payload: friends,
      });
      dispatchUser({
        type: "UPDATE_FRIEND_REQEUSTS",
        payload: sentRequest,
      });
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.error("Error adding send request:", error);
      throw error;
    }
    setBtnLoading(false);
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
        height: "100%",
        width: "100%",
        backgroundColor: "#101010",
        padding: 10,
      }}
    >
      {loading && !userData.topArtists ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ActivityIndicator size={60} />
        </View>
      ) : (
        <View>
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
              source={{ uri: userData.profile_image }}
            />
            <View style={{ gap: 5, flexWrap: "wrap", width: "100%" }}>
              <Text
                style={{ color: "white", fontSize: 25, fontFamily: "HeroRg" }}
              >
                {userData.spotify_display_name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#909090",
                    fontSize: 17,
                    fontFamily: "HeroRg",
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {userData.email}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    color: getColorByNumber(similar),
                    fontFamily: "HeroBd",
                    fontSize: 20,
                  }}
                >
                  {similar}
                </Text>
                <Text
                  style={{ fontFamily: "HeroBd", fontSize: 20, color: "white" }}
                >
                  Match
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              padding: 10,
              justifyContent: "space-evenly",
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={
                userState &&
                (userState.friends.includes(userData.uid)
                  ? () => {
                      navigation.navigate("ChatNavigator", {
                        screen: "MainChat",
                        params: {
                          receiver_uid: other_uid,
                          receiver_name: userData.spotify_display_name,
                          similar: userData.similar,
                          receiver_image: userData.profile_image,
                        },
                      });
                    }
                  : userState.sentFriendRequests.includes(userData.uid)
                  ? () => {}
                  : userState.friendRequests.includes(userData.uid)
                  ? () => {
                      handleAcceptRequest(userState.uid, userData.uid);
                    }
                  : () => handleSendRequest(userState.uid, userData.uid))
              }
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor:
                  userState &&
                  (userState.friends.includes(userData.uid)
                    ? "#d24dff"
                    : userState.sentFriendRequests.includes(userData.uid)
                    ? "yellow"
                    : userState.friendRequests.includes(userData.uid)
                    ? "red"
                    : "green"),
                borderRadius: 10,
              }}
            >
              {btnLoading ? (
                <ActivityIndicator size={20} />
              ) : (
                <Text
                  style={{
                    color: userState.friends.includes(userData.uid)
                      ? "black"
                      : userState.sentFriendRequests.includes(userData.uid)
                      ? "black"
                      : userState.friendRequests.includes(userData.uid)
                      ? "white"
                      : "white",
                    fontFamily: "HeroBd",
                    fontSize: 18,
                  }}
                >
                  {userState &&
                    (userState.friends.includes(userData.uid)
                      ? "CHAT"
                      : userState.sentFriendRequests.includes(userData.uid)
                      ? "REQUEST SENT"
                      : userState.friendRequests.includes(userData.uid)
                      ? "ACCEPT REQUEST"
                      : "SEND REQUEST")}
                </Text>
              )}
            </TouchableOpacity>
            {userState &&
              (userState.sentFriendRequests.includes(userData.uid) ||
              !userState.friends.includes(userData.uid) ? (
                !userData.friendRequests.includes(userData.uid) ? (
                  <TouchableOpacity
                    onPress={getUser}
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      backgroundColor: "#d24dff",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "HeroBd",
                        fontSize: 18,
                      }}
                    >
                      REFRESH
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )
              ) : (
                <></>
              ))}
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
                paddingBottom: 390,
                paddingTop: 10,
              }}
            >
              {userData.topArtists ? (
                userData.topArtists.map((el, idx) => {
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
                })
              ) : (
                <View></View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OtherProfile;
