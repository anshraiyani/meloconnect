import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import app, { firestore_db } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

  const handleSignup = async () => {
    if (
      email.length === 0 ||
      password.length === 0 ||
      username.length === 0 ||
      confirmPassword.length === 0
    ) {
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "all the fields are compulsory")
      );
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "Password should be atleast 6 char long")
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        (title = "MELOCONNECT"),
        (message = "Passwords do not match")
      );
      return;
    }
    try {
      const auth = getAuth(app);
      const userDetails = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userDetails.user;
      await updateProfile(user, {
        displayName: username,
      });
      console.log("User created with email:", user.email);
      console.log("User display name (username) updated:", user.displayName);

      const userCollections = collection(firestore_db, "users");
      const userDocRef = doc(userCollections, user.uid);
      await setDoc(userDocRef, {
        access_token: "",
      });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use": {
          Alert.alert(
            (title = "MELOCONNECT"),
            (message = "Email already in use")
          );
          return;
        }
      }
      console.log("Error:", err.code);
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
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View style={{ gap: 5 }}>
            <Text
              style={{ color: "white", fontSize: 28, fontFamily: "HeroBd" }}
            >
              SIGNUP
            </Text>
            <Text
              style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
            >
              Please sign up to create a new account
            </Text>
          </View>
          <View style={{ marginVertical: 35, gap: 20 }}>
            <View style={{ gap: 10 }}>
              <Text
                style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
              >
                Username
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
                placeholder="John Doe"
                placeholderTextColor={"#999999"}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
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
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Text
                style={{ color: "#999999", fontFamily: "HeroRg", fontSize: 15 }}
              >
                Confirm Password
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
          </View>
          <TouchableOpacity
            onPress={handleSignup}
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
              SIGNUP
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 15,
              justifyContent: "center",
            }}
          >
            <Text
              style={{ color: "white", fontFamily: "HeroRg", fontSize: 17 }}
            >
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text
                style={{ color: "#d24dff", fontFamily: "HeroBd", fontSize: 17 }}
              >
                Login!
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Signup;
