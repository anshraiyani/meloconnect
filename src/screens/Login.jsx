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
import app from "../../firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const auth = getAuth(app);
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
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
          paddingTop: 40,
        }}
      >
        <View style={{ flexDirection: "row", gap: 2, alignSelf: "center" }}>
          <Text style={{ color: "white", fontSize: 40, fontWeight: "bold" }}>
            MELO
          </Text>
          <Text style={{ color: "purple", fontSize: 40, fontWeight: "bold" }}>
            CONNECT
          </Text>
        </View>
        <View style={{ gap: 5, marginTop: 30 }}>
          <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
            LOGIN
          </Text>
          <Text style={{ color: "#999999" }}>Please Login to Continue</Text>
        </View>
        <View style={{ marginVertical: 35, gap: 20 }}>
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
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={{ color: "#999999" }}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "purple",
            padding: 10,
            alignItems: "center",
            borderRadius: 7,
          }}
        >
          <Text style={{ color: "white", fontSize: 25, fontWeight: "600" }}>
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
          <Text style={{ color: "white", fontSize: 15 }}>
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "purple", fontSize: 15, fontWeight: "bold" }}>
              Sign up!
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;
