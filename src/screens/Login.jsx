import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import app from "../../firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "all the fields are compulsory")
      );
      return;
    }
    try {
      const auth = getAuth(app);
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email": {
          Alert.alert((title = "MELOCONNECT"), (message = "Invalid Email"));
          break;
        }
        case "auth/invalid-credential": {
          Alert.alert(
            (title = "MELOCONNECT"),
            (message = "Password Incorrect")
          );
          break;
        }
        case "auth/user-not-found": {
          Alert.alert((title = "MELOCONNECT"), (message = "No User Found"));
          break;
        }
        case "auth/too-many-requests": {
          Alert.alert(
            (title = "MELOCONNECT"),
            (message = "Too many requests.\nTry again later.")
          );
          break;
        }
      }
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
      <StatusBar style="light" networkActivityIndicatorVisible={true} />
      <SafeAreaView
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: 20,
          paddingTop: 40,
        }}
      >
        <KeyboardAvoidingView behavior="position">
          <View style={{ flexDirection: "row", gap: 2, alignSelf: "center" }}>
            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontFamily: "HeroBd",
              }}
            >
              MELO
            </Text>
            <Text
              style={{ color: "#d24dff", fontSize: 40, fontFamily: "HeroBd" }}
            >
              CONNECT
            </Text>
          </View>
          <View style={{ gap: 5, marginTop: 30 }}>
            <Text
              style={{ color: "white", fontSize: 28, fontFamily: "HeroBd" }}
            >
              LOGIN
            </Text>
            <Text
              style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
            >
              Please Login to Continue
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
            <View style={{ gap: 10 }}>
              <Text
                style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
              >
                Password
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
                placeholder="*******"
                placeholderTextColor={"#999999"}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                <Text
                  style={{
                    color: "#d24dff",
                    fontFamily: "HeroBd",
                    fontSize: 15,
                  }}
                >
                  Forgot Password
                </Text>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
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
              LOGIN
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 25,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 17,
                fontFamily: "HeroRg",
                fontSize: 15,
              }}
            >
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text
                style={{ color: "#d24dff", fontSize: 17, fontFamily: "HeroBd" }}
              >
                Sign up!
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Login;
