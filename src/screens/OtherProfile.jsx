import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const OtherProfile = ({ route }) => {
  const other_uid = route.params["other_uid"];
  const similar = route.params["similar"];
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

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
        console.log(docSnapshot.data());
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
                paddingBottom: 300,
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
