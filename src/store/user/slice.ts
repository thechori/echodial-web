import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "../";

interface UserState {
  jwt: string | null;
}

const buildInitialState = (): UserState => ({
  jwt: localStorage.getItem("jwt") || null,
});

export const UserSlice = createSlice({
  name: "user",
  initialState: buildInitialState(),
  reducers: {
    setJwt: (state, action) => {
      state.jwt = action.payload;

      // Persist in local storage
      localStorage.setItem("jwt", action.payload);
    },
    signOut: (state) => {
      state.jwt = null;
      localStorage.removeItem("jwt");
    },
  },
});

export const { setJwt, signOut } = UserSlice.actions;

export const selectJwt = (state: RootState) => state.user.jwt;

export default UserSlice.reducer;
