import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useUser } from "../contexts/userContext";
import { StatusBar } from "expo-status-bar";

const SearchUser = ({ navigation }) => {
  const [userUid, setUserUid] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { userState, dispatchUser } = useUser();

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

  const handleSearch = async () => {
    if (userUid) {
      setLoading(true);
      setError(false);
      const docRef = doc(firestore_db, "users", userUid);
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          if (docSnapshot.data().uid !== userState.uid) {
            let user = {};
            const arr1 = userState.topArtists.map((el) => el.artist_name);
            const arr2 = docSnapshot
              .data()
              .topArtists.map((el) => el.artist_name);
            const percentage_similarity = calculateSimilarity(arr1, arr2);
            user = { ...docSnapshot.data(), similar: percentage_similarity };
            setUser(user);
            setUserUid("");
            setError(false);
          } else {
            setError(true);
            setUserUid("");
          }
        } else {
          setError(true);
          setUserUid("");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    } else {
      setError(true);
    }
  };

  return (
    <>
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
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 35, fontFamily: "HeroBd" }}
            >
              SEARCH USER
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Recommendation")}
              style={{
                borderColor: "#d24dff",
                padding: 8,
                borderRadius: 20,
                backgroundColor: "#d24dff",
              }}
            >
              <FontAwesome5 name="magic" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#404040", height: 2 }}></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <TextInput
              style={{
                backgroundColor: "#303030",
                fontSize: 17,
                padding: 7,
                borderRadius: 10,
                color: "white",
                fontFamily: "HeroRg",
                width: "90%",
              }}
              placeholder="Enter UID"
              placeholderTextColor={"#808080"}
              value={userUid}
              onChangeText={(text) => setUserUid(text)}
            />
            <TouchableOpacity onPress={handleSearch}>
              <FontAwesome name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size={34} />
          ) : error ? (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "HeroBd",
                  fontSize: 20,
                }}
              >
                No User Found
              </Text>
            </View>
          ) : user ? (
            <>
              <View style={{ padding: 10, height: "100%" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("OtherProfile", {
                      other_uid: user.uid,
                      similar: user.similar,
                    })
                  }
                  key={user.uid}
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
                    source={{ uri: user.profile_image }}
                  />
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "HeroRg",
                        fontSize: 18,
                      }}
                    >
                      {user.spotify_display_name}
                    </Text>
                    <Text
                      style={{
                        color: "#808080",
                        fontFamily: "HeroRg",
                        fontSize: 15,
                      }}
                    >
                      {user.email}
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
                          color: getColorByNumber(user.similar),
                          fontFamily: "HeroBd",
                          fontSize: 18,
                        }}
                      >
                        {user.similar}%
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
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default SearchUser;
