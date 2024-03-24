import { storage } from "services";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type registerType = {
  token: string | null;
  username: string | null;
};

const initialState: registerType = {
  token: "",
  username: "",
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    getToken: (state: registerType, action: PayloadAction<registerType>) => {
      return {
        ...state,
        token: String(storage.set("token", action.payload.token)),
        username: String(storage.set("username", action.payload.username)),
      };
    },
    clearToken: (state: registerType) => {
      storage.clear();
      return {
        ...state,
        token: null,
        username: null,
      };
    },
  },
});

export default registerSlice.reducer;
export const { getToken } = registerSlice.actions;
