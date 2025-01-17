import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
//
import type { RootState } from "../";
import { User } from "../../types";
import { windowRefreshSignal } from "../../providers/window-reloader";

export type TJwtDecoded = User & {
  iat: number;
  exp: number;
};

export type TUserState = {
  jwt: string | null;
  jwtDecoded: TJwtDecoded | null;
  subscriptionActive: boolean;
};

const buildInitialState = (): TUserState => ({
  jwt: localStorage.getItem("jwt") || null,
  jwtDecoded: JSON.parse(localStorage.getItem("jwtDecoded") || "null"),
  subscriptionActive: false,
});

export const UserSlice = createSlice({
  name: "user",
  initialState: buildInitialState(),
  reducers: {
    setJwt: (state, action) => {
      const jwtDecoded = jwt_decode(action.payload) || null;

      state.jwt = action.payload;
      state.jwtDecoded = jwtDecoded as TJwtDecoded | null;

      localStorage.setItem("jwt", action.payload);
      localStorage.setItem("jwtDecoded", JSON.stringify(jwtDecoded));
    },
    signOut: (state) => {
      state.jwt = null;
      localStorage.clear();
      windowRefreshSignal.value = 1;
    },
    setSubscriptionActive: (state, action) => {
      state.subscriptionActive = action.payload;
    },
  },
});

export const { setJwt, signOut, setSubscriptionActive } = UserSlice.actions;

export const selectJwt = (state: RootState) => state.user.jwt;
export const selectJwtDecoded = (state: RootState) => state.user.jwtDecoded;
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
