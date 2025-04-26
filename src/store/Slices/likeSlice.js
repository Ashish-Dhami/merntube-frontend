import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../helpers/axiosInstance.js';
import { toast } from 'react-toastify';
import useDelay from '../../hooks/useDelay.js';
import { updateTweetLike } from './tweetSlice.js';

const initialState = {
  loading: false,
  likedVideos: [],
  likedVideosTotal: 0,
  error: null,
};

export const getLikedVideos = createAsyncThunk(
  'getLikedVideos',
  async (query, thunkAPI) => {
    try {
      const params = new URLSearchParams(query);
      const response = await axiosInstance.get('/likes/', { params });
      return useDelay(response, 500, false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const toggleVideoLike = createAsyncThunk(
  'toggleVideoLike',
  async (videoId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/likes/v/${videoId}`);
      response?.data && toast.success(response?.data?.message);
      return response?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const toggleCommentLike = createAsyncThunk(
  'toggleCommentLike',
  async (commentId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/likes/c/${commentId}`);
      response?.data && toast.success(response?.data?.message);
      return response?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const toggleTweetLike = createAsyncThunk(
  'toggleTweetLike',
  async (tweetId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/t/${tweetId}`);
      response?.data && toast.success(response?.data?.message);
      dispatch(updateTweetLike({ tweetId }));
      return response?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      rejectWithValue(e?.response?.data?.message);
    }
  }
);
const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload.docs;
        state.likedVideosTotal = action.payload.totalDocs;
        state.error = null;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.likedVideos = [];
        state.likedVideosTotal = 0;
        state.error = action.payload;
      });
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(toggleTweetLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
