import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  dob: string;
}

const initialState: UserState = {
  user_id: "",
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  created_at: "",
  updated_at: "",
  dob: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return { ...initialState };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
