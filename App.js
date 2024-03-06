import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import app from "./firebase";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import AuthNavigator from "./src/navigators/AuthNavigator";
import SpotifyNavigator from "./src/navigators/SpotifyNavigator";
import Splash from "./src/screens/Splash";
import { UserProvider } from "./src/contexts/userContext";

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
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        {loading ? (
          <Splash />
        ) : user ? (
          <SpotifyNavigator user={user} />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </UserProvider>
  );
}
