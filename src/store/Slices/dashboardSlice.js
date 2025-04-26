import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance.js";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  channelStats: null,
  channelVideos: [],
  error: null,
};

export const getChannelStats = createAsyncThunk(
  "getChannelStats",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/dashboard/");
      toast.success(response.data.message);
      return response.data.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);
export const getChannelVideos = createAsyncThunk(
  "getChannelVideos",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/dashboard/videos");
      toast.success(response.data.message);
      return response.data.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChannelStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.channelStats = action.payload;
        state.error = null;
      })
      .addCase(getChannelStats.rejected, (state, action) => {
        state.loading = false;
        state.channelStats = null;
        state.error = action.payload;
      });
    builder
      .addCase(getChannelVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.channelVideos = action.payload;
        state.error = null;
      })
      .addCase(getChannelVideos.rejected, (state, action) => {
        state.loading = false;
        state.channelVideos = null;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
