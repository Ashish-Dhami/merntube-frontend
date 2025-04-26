import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../helpers/axiosInstance.js';
import { toast } from 'react-toastify';
import useDelay from '../../hooks/useDelay.js';

const initialState = {
  loading: false,
  tweets: {
    //STATE NORMALIZATION IMPLEMENTED HERE - production level approach
    byId: {},
    allIds: [],
  },
  totalTweets: 0,
  hasNextPage: false,
  error: null,
};

export const createTweet = createAsyncThunk(
  'createTweet',
  async (content, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/tweets/create', { content });
      return useDelay(response, 500);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getUserTweets = createAsyncThunk(
  'getUserTweets',
  async ({ userId, query }, thunkAPI) => {
    try {
      const params = new URLSearchParams(query);
      const response = await axiosInstance.get(`/tweets/listTweets/${userId}`, {
        params,
      });
      return query.page === 1
        ? response?.data?.data
        : useDelay(response, 500, false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const updateTweet = createAsyncThunk(
  'updateTweet',
  async ({ tweetId, newContent }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/tweets/${tweetId}`, {
        newContent,
      });
      return useDelay(response, 500);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const deleteTweet = createAsyncThunk(
  'deleteTweet',
  async (tweetId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/tweets/${tweetId}`);
      response?.data && toast.success(response?.data?.message);
      return tweetId;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    resetTweets: (state) => {
      state.tweets = { byId: {}, allIds: [] };
      state.hasNextPage = false;
      state.totalTweets = 0;
    },
    updateTweetLike: (state, action) => {
      const { tweetId } = action.payload;
      if (state.tweets.byId[tweetId]) {
        const tweet = state.tweets.byId[tweetId];
        tweet.isLiked = !tweet.isLiked;
        tweet.likesCount += tweet.isLiked ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state) => {
        state.loading = false;
        // state.tweets = {
        //   byId: { [action.payload._id]: action.payload, ...state.tweets.byId },
        //   allIds: [action.payload._id, ...state.tweets.allIds],
        // };
        // state.totalTweets++;
        state.error = null;
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getUserTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = false;

        const { page } = action.meta.arg.query;
        const byId = page === 1 ? {} : { ...state.tweets.byId };
        const allIds = page === 1 ? [] : [...state.tweets.allIds];

        action.payload.docs.forEach((tweet) => {
          if (!allIds.includes(tweet._id)) {
            byId[tweet._id] = tweet;
            allIds.push(tweet._id);
          }
        });
        state.tweets = { byId, allIds };
        state.hasNextPage = action.payload.hasNextPage;
        state.totalTweets = action.payload.totalDocs;

        state.error = null;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.hasNextPage = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        const oldTweet = state.tweets.byId[action.payload._id];
        state.tweets.byId[action.payload._id] = {
          ...oldTweet,
          content: action.payload.content,
          updatedAt: action.payload.updatedAt,
        };
        state.error = null;
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.loading = false;
        const { [action.payload]: _, ...newById } = state.tweets.byId;
        state.tweets = {
          byId: newById,
          allIds: state.tweets.allIds.filter((id) => id !== action.payload),
        };
        state.totalTweets--;
        state.error = null;
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTweets, updateTweetLike } = tweetSlice.actions;
export default tweetSlice.reducer;
