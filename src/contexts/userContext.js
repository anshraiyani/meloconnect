import React, { createContext, useContext, useReducer } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    uid: "",
    email: "",
    spotify_display_name: "",
    profile_image: "",
    topArtists: [],
    friends: [],
    friendRequests: [],
    sentFriendRequest: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_USER":
        return { ...state, ...action.payload };
      default:
        return state;
    }
  };

  const [userState, dispatchUser] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ userState, dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("error from userContext");
  }
  return context;
};
