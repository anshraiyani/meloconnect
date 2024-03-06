import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const ChatList = () => {
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
      </View>
      <View style={{ backgroundColor: "#404040", height: 2 }}></View>
    </SafeAreaView>
  );
};

export default ChatList;
