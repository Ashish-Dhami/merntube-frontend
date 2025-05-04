import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../helpers/axiosInstance.js';
import { toast } from 'react-toastify';
import useDelay from '../../hooks/useDelay.js';

const initialState = {
  loading: false,
  comments: [],
  totalComments: 0,
  hasMoreComments: false,
  error: null,
};

export const addComment = createAsyncThunk(
  'addComment',
  async ({ videoId, content }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        content,
      });
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getVideoComments = createAsyncThunk(
  'getVideoComments',
  async ({ videoId, query }, thunkAPI) => {
    try {
      const params = new URLSearchParams(query);
      const response = await axiosInstance.get(`/comments/${videoId}`, {
        params,
      });
      return useDelay(response, 900, false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const updateComment = createAsyncThunk(
  'updateComment',
  async ({ commentId, newContent }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/comments/${commentId}`, {
        newContent,
      });
      response?.data && toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const deleteComment = createAsyncThunk(
  'deleteComment',
  async (commentId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`);
      response?.data && toast.success(response?.data?.message);
      return commentId;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    cleanupComments: (state) => {
      state.comments = [];
      state.hasMoreComments = false;
      state.totalComments = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(...action.payload.docs);
        state.hasMoreComments = action.payload.hasNextPage;
        state.totalComments = action.payload.totalDocs;
        state.error = null;
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.comments = [];
        state.hasMoreComments = false;
        state.totalComments = 0;
        state.error = action.payload;
      });
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.map((comment, index) => {
          if (comment._id === action.payload._id)
            state.comments[index].comment = action.payload.content;
        });
        state.error = null;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
        state.totalComments--;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { cleanupComments } = commentSlice.actions;
export default commentSlice.reducer;
