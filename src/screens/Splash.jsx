import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Splash = () => {

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
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        flexDirection:'row'
      }}
    >
      <Text style={{color:'white',fontSize:50,fontFamily:'HeroBd'}}>Melo</Text>
      <Text style={{color:'#d24dff',fontSize:50,fontFamily:'HeroBd'}}>Connect</Text>
    </View>
  );
};

export default Splash;
