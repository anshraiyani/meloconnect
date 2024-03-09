import {
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useUser } from "../contexts/userContext";
import { firestore_db } from "../../firebase";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const MainChat = ({ navigation, route }) => {
  const receiver_uid = route.params["receiver_uid"];
  const receiver_name = route.params["receiver_name"];
  const similar = route.params["similar"];
  const receiver_image = route.params["receiver_image"];
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const scrollViewRef = useRef();
  const { userState, dispatchUser } = useUser();

  const getTime = (firebase_timestamp) => {
    const jsDate = firebase_timestamp.toDate();

    // Get day, month, and year
    const day = jsDate.getDate().toString().padStart(2, "0");
    const month = (jsDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = jsDate.getFullYear().toString().slice(-2); // Get last two digits of the year

    // Get hours and minutes
    const hours = jsDate.getHours().toString().padStart(2, "0");
    const minutes = jsDate.getMinutes().toString().padStart(2, "0");

    // Create formatted date-time string
    // const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
    const formattedDateTime = `${hours}:${minutes}`;
    return formattedDateTime;
  };

  const handleSend = async () => {
    if (message.length !== 0) {
      const timeStamp = serverTimestamp();
      const id = `${Date.now()}`;
      const _doc = {
        _id: id,
        timeStamp: timeStamp,
        receiver_id: receiver_uid,
        sender_id: userState.uid,
        data: message,
      };
      setMessage("");
      await addDoc(collection(firestore_db, "messages"), _doc)
        .then(() => {
          console.log("message sent successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestore_db, "messages"),
      orderBy("timeStamp", "asc"),
      where("sender_id", "in", [receiver_uid, userState.uid]),
      where("receiver_id", "in", [receiver_uid, userState.uid])
    );
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      console.log(upMsg);
      setChat(upMsg);
    });
    return unsubscribe;
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
    <KeyboardAvoidingView>
      <SafeAreaView
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#101010",
          //   padding: 5,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            paddingHorizontal: 5,
            paddingVertical: 5,
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={35} color="#d24dff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            onPress={() =>
              navigation.navigate("OtherProfile", {
                other_uid: receiver_uid,
                similar: similar,
              })
            }
          >
            <Image
              style={{ height: 50, width: 50, borderRadius: 25 }}
              source={{ uri: receiver_image }}
            />
            <Text
              style={{ color: "white", fontSize: 30, fontFamily: "HeroBd" }}
            >
              {receiver_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#404040", height: 2 }}></View>
        <ScrollView
          style={{
            backgroundColor: "#303030",
            padding: 5,
          }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {chat &&
            chat.map((item, id) => {
              if (item.sender_id === userState.uid) {
                return (
                  <View
                    key={id}
                    style={{
                      backgroundColor: "#d24dff",
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      alignSelf: "flex-end",
                      borderRadius: 8,
                      marginVertical: 2,
                      maxWidth: "65%",
                      gap: 5,
                      marginHorizontal:5
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontFamily: "HeroBd",
                        alignSelf: "flex-end",
                      }}
                    >
                      {item.data}
                    </Text>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontSize: 11,
                        fontFamily: "HeroRg",
                        color: "white",
                      }}
                    >
                      {item.timeStamp && getTime(item.timeStamp)}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View
                    key={id}
                    style={{
                      backgroundColor: "#101010",
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      alignSelf: "flex-start",
                      borderRadius: 8,
                      marginVertical: 2,
                      maxWidth: "65%",
                      gap: 5,
                      marginHorizontal:5
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontFamily: "HeroBd",
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.data}
                    </Text>
                    <Text
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 11,
                        fontFamily: "HeroRg",
                        color: "white",
                      }}
                    >
                      {getTime(item.timeStamp)}
                    </Text>
                  </View>
                );
              }
            })}
        </ScrollView>
        <View
          style={{
            backgroundColor: "#353535",
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 20,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#202020",
              color: "white",
              fontSize: 17,
              padding: 8,
              borderRadius: 15,
              width: "85%",
            }}
            placeholder="Type Here..."
            placeholderTextColor={"#808080"}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: "#202020",
              padding: 8,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="send" size={26} color="#d24dff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MainChat;
