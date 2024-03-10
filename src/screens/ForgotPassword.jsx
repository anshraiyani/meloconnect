import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "../../firebase";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (email.length === 0) {
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "all the fields are compulsory")
      );
      return;
    }
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "Reset link sent to " + email)
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
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
    <>
      <SafeAreaView
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: 20,
        }}
      >
        <KeyboardAvoidingView behavior="position">
          <View style={{ gap: 5, marginTop: 30 }}>
            <Text
              style={{ color: "white", fontSize: 28, fontFamily: "HeroBd" }}
            >
              RESET PASSWORD
            </Text>
            <Text
              style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
            >
              Enter Registered Email
            </Text>
          </View>
          <View style={{ marginVertical: 35, gap: 20 }}>
            <View style={{ gap: 10 }}>
              <Text
                style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
              >
                Email ID
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#252525",
                  height: 50,
                  paddingLeft: 15,
                  borderRadius: 5,
                  fontSize: 15,
                  color: "white",
                  fontFamily: "HeroRg",
                  fontSize: 17,
                }}
                placeholder="johndoe@gmail.com"
                placeholderTextColor={"#999999"}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleReset}
            style={{
              backgroundColor: "#d24dff",
              padding: 10,
              alignItems: "center",
              borderRadius: 7,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 28, fontFamily: "HeroBd" }}
            >
              RESET
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;
