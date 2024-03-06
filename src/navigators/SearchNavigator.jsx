import { View, Text } from "react-native";
import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import SearchUser from "../screens/SearchUser";
import Recommendation from "../screens/Recommendation";
import OtherProfile from "../screens/OtherProfile";

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
      <Stack.Screen name="SearchUser" component={SearchUser} />
      <Stack.Screen name="Recommendation" component={Recommendation} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
