import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance.js";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  channelSubscribers: [],
  subscribedChannels: [],
  error: null,
};

export const toggleSubscription = createAsyncThunk(
  "toggleSubscription",
  async (channelId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/${channelId}/toggleSub`
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getUserChannelSubscribers = createAsyncThunk(
  "getUserChannelSubscribers",
  async (channelId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/${channelId}/subscribers`
      );
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getSubscribedChannels = createAsyncThunk(
  "getSubscribedChannels",
  async (subscriberId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/${subscriberId}/subscribedTo`
      );
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.channelSubscribers = action.payload;
        state.error = null;
      })
      .addCase(getUserChannelSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.channelSubscribers = [];
        state.error = action.payload;
      });
    builder
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload;
        state.error = null;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.subscribedChannels = [];
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
