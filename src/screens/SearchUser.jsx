import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const SearchUser = ({ navigation }) => {
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
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 35, fontFamily: "HeroBd" }}>
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
      </View>
    </SafeAreaView>
  );
};

export default SearchUser;
