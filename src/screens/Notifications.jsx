import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/userContext";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import app, { firestore_db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { StatusBar } from "expo-status-bar";

const Notifications = ({ navigation }) => {
  const { userState, dispatchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);
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

  const getFriendRequests = async () => {
    setLoading(true);
    const requestArray = [...userState.friendRequests];
    const requestListData = await Promise.all(
      requestArray.map(async (id) => {
        const userData = await getUser(id);
        return { ...userData };
      })
    );

    setRequestList(requestListData);
    setLoading(false);
  };

  useEffect(() => {
    getFriendRequests();
  }, [userState.friendRequests]);

  const getCurrentUser = async () => {
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
            alignItems: "center",
            marginBottom: 5,
            gap: 5,
          }}
        >
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back-circle-outline"
                size={35}
                color="#d24dff"
              />
            </TouchableOpacity>
          </View>
          <Text style={{ color: "white", fontSize: 35, fontFamily: "HeroBd" }}>
            NOTIFICATIONS
          </Text>
        </View>
        <View style={{ backgroundColor: "#404040", height: 2 }}></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={getCurrentUser}
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: "#d24dff",
              alignItems: "center",
              paddingHorizontal: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ color: "white", fontFamily: "HeroRg", fontSize: 15 }}
            >
              REFRESH
            </Text>
            <Ionicons name="refresh-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size={34} />
        ) : (
          <ScrollView style={{ padding: 10, height: "100%" }}>
            {requestList &&
              requestList.map((x) => {
                return (
                  <View
                    key={x}
                    style={{
                      padding: 10,
                      marginVertical: 10,
                      backgroundColor: "#202020",
                      borderRadius: 10,
                      alignItems: "center",
                    }}
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
                            fontSize: 18,
                          }}
                        >
                          {x.spotify_display_name}
                        </Text>
                        <Text
                          style={{
                            color: "#808080",
                            fontFamily: "HeroRg",
                            fontSize: 15,
                          }}
                        >
                          {x.email}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: getColorByNumber(x.similar),
                              fontFamily: "HeroBd",
                              fontSize: 18,
                            }}
                          >
                            {x.similar}%
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "HeroRg",
                              fontSize: 18,
                            }}
                          >
                            Match
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        width: "100%",
                        marginTop: 18,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          handleAcceptRequest(userState.uid, x.uid)
                        }
                        style={{
                          backgroundColor: "red",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ color: "white", fontFamily: "HeroBd" }}>
                          {btnLoading ? (
                            <ActivityIndicator size={20} />
                          ) : (
                            "ACCEPT REQUEST"
                          )}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#d24dff",
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() =>
                          navigation.navigate("OtherProfile", {
                            other_uid: x.uid,
                            similar: x.similar,
                          })
                        }
                      >
                        <Text style={{ color: "white", fontFamily: "HeroBd" }}>
                          VIEW PROFILE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default Notifications;
