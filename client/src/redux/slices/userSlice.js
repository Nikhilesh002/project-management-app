// create redux slice
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


// make http req using redux-thunk middleware
export const userLoginThunk = createAsyncThunk('user-login', async (userCredObj, thunkApi) => {
  try {
    const res = await axios.post("http://localhost:4000/project-api/login", userCredObj);
    if (res.data.message === "Login Success") {
      // store token in local/session storage
      localStorage.setItem("token", res.data.token);
      // return data
    }
    else {
      return thunkApi.rejectWithValue(res.data.message);
    }
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
})

export const userSlice = createSlice({
  name: "user-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccured: false,
    errMsg: "",
  },
  // local
  reducers: {
    resetState: (state, action) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = {};
      state.errorOccured = {};
      state.errMsg = "";
    }
  },
  // external
  extraReducers: builder => builder
    .addCase(userLoginThunk.pending, (state, action) => {
      state.isPending = true;
    })
    .addCase(userLoginThunk.fulfilled, (state, action) => {
      state.isPending = false;
      state.loginUserStatus = true;
      state.currentUser = action.payload.user;
      state.errorOccured = false;
      state.errMsg = "";
    })
    .addCase(userLoginThunk.rejected, (state, action) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = {};
      state.errorOccured = true;
      state.errMsg = action.payload;
    })
});

// export action creater functions
export const { resetState } = userSlice.actions;

// export root reducer of this slice
export default userSlice.reducer;
