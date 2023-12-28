import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import app from "./firebase";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import AuthNavigator from "./src/navigators/AuthNavigator";
import SpotifyNavigator from "./src/navigators/SpotifyNavigator";
import { Text } from "react-native";
import SpotifyConnect from "./src/screens/SpotifyConnect";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false)
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {loading ? (
        <Text>Loading</Text>
      ) : user ? (
        <SpotifyNavigator user={user} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
