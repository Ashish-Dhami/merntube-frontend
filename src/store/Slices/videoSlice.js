import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../helpers/axiosInstance.js';
import { toast } from 'react-toastify';
import useDelay from '../../hooks/useDelay.js';

const initialState = {
  uploading: false,
  uploaded: false,
  loading: false,
  videos: [],
  totalVideos: 0,
  hasNextPage: false,
  video: null,
  publishToggled: false,
  error: null,
};

export const getAllVideos = createAsyncThunk(
  'getAllVideos',
  async (query, thunkAPI) => {
    try {
      const params = new URLSearchParams(query);
      const response = await axiosInstance.get('/videos/all', { params });
      // toast.success(response?.data?.message);
      return query.page === 1
        ? response?.data?.data
        : useDelay(response, 500, false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getVideoById = createAsyncThunk(
  'getVideoById',
  async (videoId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`);
      //toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const publishAVideo = createAsyncThunk(
  'publishAVideo',
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('video', data.video);
      formData.append('thumbnail', data.thumbnail);
      const response = await axiosInstance.post('/videos/publish', formData);
      return useDelay(response);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const updateVideo = createAsyncThunk(
  'updateVideo',
  async ({ videoId, data }, thunkAPI) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
      const response = await axiosInstance.patch(
        `/videos/${videoId}`,
        formData
      );
      return useDelay(response);
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const deleteVideo = createAsyncThunk(
  'deleteVideo',
  async (videoId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      response?.data && toast.success(response?.data?.message);
      return response?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const togglePublishStatus = createAsyncThunk(
  'togglePublishStatus',
  async (videoId, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `/videos/togglePublish/${videoId}`
      );
      response?.data && toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    makeVideosNull: (state) => {
      state.videos = [];
      state.hasNextPage = false;
      state.totalVideos = 0;
    },
    makeVideoNull: (state) => {
      state.video = null;
    },
    resetStateOnUnmount: (state) => {
      state.uploaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;

        const { page } = action.meta.arg;
        if (page === 1) state.videos = action.payload.videos;
        else state.videos = [...state.videos, ...action.payload.videos];
        state.hasNextPage = action.payload.hasNextPage;
        state.totalVideos = action.payload.totalVideos;
        state.error = null;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.hasNextPage = false;
        state.error = action.payload;
      });
    builder
      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
        state.error = null;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(publishAVideo.pending, (state) => {
        state.uploading = true;
        state.uploaded = false;
        state.error = null;
      })
      .addCase(publishAVideo.fulfilled, (state) => {
        state.uploading = false;
        state.uploaded = true;
        state.error = null;
      })
      .addCase(publishAVideo.rejected, (state, action) => {
        state.uploading = false;
        state.uploaded = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateVideo.pending, (state) => {
        state.uploading = true;
        state.uploaded = false;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploaded = true;
        state.videos = state.videos.map((video) =>
          video._id === action.payload._id
            ? {
                ...video,
                title: action.payload.title,
                description: action.payload.description,
                thumbnail: action.payload.thumbnail,
                updatedAt: action.payload.updatedAt,
              }
            : video
        );
        state.error = null;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.uploading = false;
        state.uploaded = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.loading = false;
        state.totalVideos--;
        state.error = null;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(togglePublishStatus.fulfilled, (state) => {
        state.publishToggled = !state.publishToggled;
        state.error = null;
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { makeVideosNull, makeVideoNull, resetStateOnUnmount } =
  videoSlice.actions;
export default videoSlice.reducer;
