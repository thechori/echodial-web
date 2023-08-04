import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
//
import type { RootState } from "../";

export type TJwtDecoded = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

export type TUserState = {
  jwt: string | null;
  jwtDecoded: TJwtDecoded | null;
};

const buildInitialState = (): TUserState => ({
  jwt: localStorage.getItem("jwt") || null,
  jwtDecoded: JSON.parse(localStorage.getItem("jwtDecoded") || "null"),
});

export const UserSlice = createSlice({
  name: "user",
  initialState: buildInitialState(),
  reducers: {
    setJwt: (state, action) => {
      state.jwt = action.payload; // string
      const jwtDecoded = jwt_decode(action.payload) || null; //
      state.jwtDecoded = jwtDecoded as TJwtDecoded | null;

      // Persist in local storage
      localStorage.setItem("jwt", action.payload);
      localStorage.setItem("jwtDecoded", JSON.stringify(jwtDecoded));
    },
    signOut: (state) => {
      state.jwt = null;
      localStorage.removeItem("jwt");
      localStorage.removeItem("jwtDecoded");
    },
  },
});

export const { setJwt, signOut } = UserSlice.actions;

export const selectJwt = (state: RootState) => state.user.jwt;
export const selectEmail = (state: RootState) => {
  const { jwtDecoded } = state.user;
  if (!jwtDecoded) return undefined;
  return jwtDecoded.email;
};
export const selectPhone = (state: RootState) => {
  const { jwtDecoded } = state.user;
  if (!jwtDecoded) return "";
  return jwtDecoded.phone;
};
export const selectFirstName = (state: RootState) => {
  const { jwtDecoded } = state.user;
  if (!jwtDecoded) return "";
  return jwtDecoded.first_name;
};
export const selectLastName = (state: RootState) => {
  const { jwtDecoded } = state.user;
  if (!jwtDecoded) return "";
  return jwtDecoded.last_name;
};

export default UserSlice.reducer;
