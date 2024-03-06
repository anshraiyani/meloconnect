import { View, Text } from "react-native";
import React from "react";
import ChatList from "../screens/ChatList";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
