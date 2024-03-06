import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { firestore_db } from "../../firebase";
import { useUser } from "../contexts/userContext";
import { collection, getDocs } from "firebase/firestore";

const Recommendation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { userState, dispatchUser } = useUser();
  const [recommendations, setRecommendations] = useState([]);

  function calculateSimilarity(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const similarity = intersection.size / union.size;
    const percentageSimilarity = similarity * 100;

    return percentageSimilarity.toFixed(2);
  }

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const userCollections = collection(firestore_db, "users");
      const usersSnapshot = await getDocs(userCollections);
      let users = [];
      usersSnapshot.forEach((x) => {
        const arr1 = userState.topArtists.map((el) => el.artist_name);
        const arr2 = x.data().topArtists.map((el) => el.artist_name);
        const percentage_similarity = calculateSimilarity(arr1, arr2);
        users.push({ ...x.data(), similar: percentage_similarity });
      });
      users = users.filter((x) => x.uid !== userState.uid);
      users = users.sort(
        (a, b) => parseFloat(b.similar) - parseFloat(a.similar)
      );
      setRecommendations(users);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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

  useState(() => {
    fetchRecommendations();
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

  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#101010",
        padding: 10,
      }}
    >
      <View>
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
          <Text style={{ color: "white", fontSize: 30, fontFamily: "HeroBd" }}>
            RECOMMENDATIONS
          </Text>
        </View>
        <View style={{ backgroundColor: "#404040", height: 2 }}></View>

        {loading ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={60} />
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={fetchRecommendations}
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
                <Ionicons
                  name="refresh-circle-outline"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 10, height: "100%" }}>
              {recommendations.map((x) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("OtherProfile", {
                      other_uid: x.uid,
                      similar: x.similar,
                    })
                  }
                  key={x.uid}
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    marginVertical: 10,
                    backgroundColor: "#202020",
                    borderRadius: 10,
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Recommendation;
