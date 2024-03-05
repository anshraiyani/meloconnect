import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
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
      console.log("Error:", err.code);
    }
  };

  return (
    <KeyboardAvoidingView>
      <SafeAreaView
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          padding: 20,
        }}
      >
        <View style={{ gap: 5 }}>
          <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
            SIGNUP
          </Text>
          <Text style={{ color: "#999999" }}>
            Please sign up to create a new account
          </Text>
        </View>
        <View style={{ marginVertical: 35, gap: 20 }}>
          <View style={{ gap: 10 }}>
            <Text style={{ color: "#999999" }}>Username</Text>
            <TextInput
              style={{
                backgroundColor: "#1A1A1A",
                height: 50,
                paddingLeft: 15,
                borderRadius: 5,
                fontSize: 15,
                color: "white",
              }}
              placeholder="John Doe"
              placeholderTextColor={"#999999"}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ color: "#999999" }}>Email ID</Text>
            <TextInput
              style={{
                backgroundColor: "#1A1A1A",
                height: 50,
                paddingLeft: 15,
                borderRadius: 5,
                fontSize: 15,
                color: "white",
              }}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={"#999999"}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ color: "#999999" }}>Password</Text>
            <TextInput
              style={{
                backgroundColor: "#1A1A1A",
                height: 50,
                paddingLeft: 15,
                borderRadius: 5,
                fontSize: 15,
                color: "white",
              }}
              placeholder="*******"
              placeholderTextColor={"#999999"}
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ color: "#999999" }}>Confirm Password</Text>
            <TextInput
              style={{
                backgroundColor: "#1A1A1A",
                height: 50,
                paddingLeft: 15,
                borderRadius: 5,
                fontSize: 15,
                color: "white",
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
            backgroundColor: "purple",
            padding: 10,
            alignItems: "center",
            borderRadius: 7,
          }}
        >
          <Text style={{ color: "white", fontSize: 25, fontWeight: "600" }}>
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
          <Text style={{ color: "white", fontSize: 15 }}>
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: "purple", fontSize: 15, fontWeight: "bold" }}>
              Login!
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
