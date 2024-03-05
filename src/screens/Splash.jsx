import { View, Text } from "react-native";
import React from "react";

const Splash = () => {
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
      <Text style={{color:'white',fontSize:50}}>Melo</Text>
      <Text style={{color:'purple',fontSize:50}}>Connect</Text>
    </View>
  );
};

export default Splash;
