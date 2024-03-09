import { View, Text } from "react-native";
import React from "react";
import ChatList from "../screens/ChatList";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import Notifications from "../screens/Notifications";
import OtherProfile from "../screens/OtherProfile";
import MainChat from "../screens/MainChat";

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
      <Stack.Screen name="MainChat" component={MainChat} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
