import { createSlice } from "@reduxjs/toolkit";
//
import type { RootState } from "../";

interface UserState {
  jwt: string | null;
}

const initialState: UserState = {
  jwt: null,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setJwt: (state, action) => {
      state.jwt = action.payload;
    },
  },
});

export const { setJwt } = UserSlice.actions;

export const selectJwt = (state: RootState) => state.user.jwt;

export default UserSlice.reducer;
