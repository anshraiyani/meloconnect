import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useUser } from "../contexts/userContext";
import { Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { StatusBar } from "expo-status-bar";

const ChatList = ({ navigation }) => {
  const { userState, dispatchUser } = useUser();
  const [friendlist, setFriendlist] = useState([]);
  const [loading, setLoading] = useState(false);

  function calculateSimilarity(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const similarity = intersection.size / union.size;
    const percentageSimilarity = similarity * 100;

    return percentageSimilarity.toFixed(2);
  }

  const getUser = async (id) => {
    const docRef = doc(firestore_db, "users", id);
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        let user = {};
        const arr1 = userState.topArtists.map((el) => el.artist_name);
        const arr2 = docSnapshot.data().topArtists.map((el) => el.artist_name);
        const percentage_similarity = calculateSimilarity(arr1, arr2);
        user = { ...docSnapshot.data(), similar: percentage_similarity };
        return user;
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  const getFriends = async () => {
    setLoading(true);
    const friendsArray = [...userState.friends];
    const friendListData = await Promise.all(
      friendsArray.map(async (id) => {
        const userData = await getUser(id);
        return { ...userData };
      })
    );
    setFriendlist(friendListData);
    setLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, [userState.friends]);

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
    <>
      <StatusBar style="light" networkActivityIndicatorVisible={true} />
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
          <Text style={{ color: "white", fontSize: 35, fontFamily: "HeroBd" }}>
            CHATS
          </Text>
          {userState && (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Notifications")}
              >
                <Feather name="bell" size={28} color="#d24dff" />
                {userState.friendRequests.length !== 0 ? (
                  <View
                    style={{
                      backgroundColor: "red",
                      height: 25,
                      width: 25,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 12,
                      position: "absolute",
                      top: -15,
                      right: -10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "HeroRg",
                        fontSize: 17,
                      }}
                    >
                      {userState.friendRequests.length > 9
                        ? "9+"
                        : userState.friendRequests.length}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{ backgroundColor: "#404040", height: 2 }}></View>
        <ScrollView>
          {loading ? (
            <ActivityIndicator key={1} size={30} />
          ) : (
            friendlist &&
            friendlist.map((x) => {
              return (
                <TouchableOpacity
                  key={x.uid}
                  style={{
                    padding: 10,
                    marginVertical: 10,
                    backgroundColor: "#202020",
                    borderRadius: 10,
                  }}
                  onPress={() =>
                    navigation.navigate("MainChat", {
                      receiver_uid: x.uid,
                      receiver_name: x.spotify_display_name,
                      similar: x.similar,
                      receiver_image: x.profile_image,
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ height: 70, width: 70, borderRadius: 70 }}
                      source={{ uri: x.profile_image }}
                    />
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "HeroRg",
                          fontSize: 25,
                        }}
                      >
                        {x.spotify_display_name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ChatList;
