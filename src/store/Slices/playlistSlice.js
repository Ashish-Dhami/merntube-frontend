import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance.js";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  playlists: [],
  myPlaylists: [],
  error: null,
};

export const createPlaylist = createAsyncThunk(
  "createPlaylist",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/playlists/create", data);
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getUserPlaylists = createAsyncThunk(
  "getUserPlaylists",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/playlists/user/${userId}`);
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const getPlaylistById = createAsyncThunk(
  "getPlaylistById",
  async (playlistId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/playlists/${playlistId}`);
      toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const updatePlaylist = createAsyncThunk(
  "updatePlaylist",
  async ({ playlistId, data }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `/playlists/${playlistId}`,
        data
      );
      response?.data && toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (playlistId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/playlists/${playlistId}`);
      response?.data && toast.success(response?.data?.message);
      return playlistId;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const addVideoToPlaylist = createAsyncThunk(
  "addVideoToPlaylist",
  async ({ videoId, playlistId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `/playlists/add/${videoId}/${playlistId}`
      );
      response?.data && toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);
export const removeVideoFromPlaylist = createAsyncThunk(
  "removeVideoFromPlaylist",
  async ({ videoId, playlistId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `/playlists/remove/${videoId}/${playlistId}`
      );
      response?.data && toast.success(response?.data?.message);
      return response?.data?.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      return thunkAPI.rejectWithValue(e?.response?.data?.message);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlaylists.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
        state.error = null;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.playlists = [];
        state.error = action.payload;
      });
    builder
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlaylists.map((playlist, index) =>
          playlist._id === action.payload._id
            ? (state.myPlaylists[index] = action.payload)
            : null
        );
        state.error = null;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlaylists.map((playlist, index) =>
          playlist._id === action.payload._id
            ? (state.myPlaylists[index] = action.payload)
            : null
        );
        state.error = null;
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlaylists.map((playlist, index) =>
          playlist._id === action.payload._id
            ? (state.myPlaylists[index] = action.payload)
            : null
        );
        state.error = null;
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlaylists = state.myPlaylists.filter(
          (playlist) => playlist._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;
