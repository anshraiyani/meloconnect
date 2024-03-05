import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          let iconname;
          if (route.name === "Profile") {
            iconname = focused
              ? "person-circle-sharp"
              : "person-circle-outline";
          } else if (route.name === "ChatNavigator") {
            iconname = focused ? "chatbox-sharp" : "chatbox-outline";
          } else if (route.name === "SearchNavigator") {
            iconname = focused ? "search-sharp" : "search-outline";
          }
          return <Ionicons name={iconname} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#d24dff",
        tabBarStyle: {
          backgroundColor: "black",
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "PROFILE" }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
