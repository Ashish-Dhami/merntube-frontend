import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../helpers/axiosInstance.js';
import { toast } from 'react-toastify';
import useDelay from '../../hooks/useDelay.js';

const initialState = {
  loading: false,
  userData: null,
  authStatus: false,
  error: null,
  userProfileData: null,
  watchHistory: [],
};

export const registerUser = createAsyncThunk(
  'register',
  async (data, thunkAPI) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    formData.append('username', data.username);
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      const response = await axiosInstance.post('/users/register', formData);
      return useDelay(response);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const loginUser = createAsyncThunk('login', async (data, thunkAPI) => {
  try {
    const result = await axiosInstance.post('/users/login', data);
    return useDelay(result);
  } catch (err) {
    toast.error(
      err?.response?.data?.message || 'error occurred while logging in'
    );
    return thunkAPI.rejectWithValue(err?.response?.data?.message);
  }
});
export const logoutUser = createAsyncThunk('logout', async (_, thunkAPI) => {
  try {
    const result = await axiosInstance.post('/users/logout');
    toast.success(result?.data?.message || 'logout successful');
    return result?.data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || 'error occurred while logging out'
    );
    return thunkAPI.rejectWithValue(err?.response?.data?.message);
  }
});
export const refreshAccessToken = createAsyncThunk(
  'refreshToken',
  async (_, thunkAPI) => {
    try {
      const result = await axiosInstance.post('/users/refreshAccessToken');
      return useDelay(result, 900, false);
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const changePassword = createAsyncThunk(
  'changePassword',
  async (data, thunkAPI) => {
    try {
      const result = await axiosInstance.post('/users/changePassword', data);
      // toast.success(result?.data?.message);
      return result?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message, { autoClose: 3000 });
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  'getCurrentUser',
  async (_, thunkAPI) => {
    try {
      const result = await axiosInstance.get('/users/currentUser');
      // toast.success(result?.data?.message);
      return result?.data?.data?.currentUser;
    } catch (err) {
      // toast.error(err?.response?.data?.message);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const updateAccountDetails = createAsyncThunk(
  'updateAccountDetails',
  async (data, thunkAPI) => {
    try {
      const result = await axiosInstance.patch('/users/updateDetails', data);
      toast.success(result?.data?.message);
      return result?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const updateUserAvatar = createAsyncThunk(
  'updateUserAvatar',
  async (data, thunkAPI) => {
    const toastId = toast.loading('avatar is being updated');
    try {
      const formData = new FormData();
      formData.append('avatar', data);
      const response = await axiosInstance.patch(
        '/users/updateAvatar',
        formData
      );
      response?.data &&
        toast.update(toastId, {
          render: response?.data?.message,
          type: 'success',
          isLoading: false,
          autoClose: 1000,
        });
      return response?.data?.data?.user;
    } catch (err) {
      toast.update(toastId, {
        render: err?.response?.data?.message,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const getUserChannelProfile = createAsyncThunk(
  'getUserChannelProfile',
  async (username, thunkAPI) => {
    try {
      const result = await axiosInstance.get(`/users/userProfile/${username}`);
      toast.success(result?.data?.message);
      return result?.data?.data;
    } catch (err) {
      // toast.error(err?.response?.data?.message);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const getWatchHistory = createAsyncThunk(
  'getWatchHistory',
  async (_, thunkAPI) => {
    try {
      const result = await axiosInstance.get('/users/watchHistory');
      toast.success(result?.data?.message);
      return result?.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message);
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);

export const getSavedUser = createAsyncThunk(
  'getSavedUser',
  async (_, thunkAPI) => {
    try {
      const result = await axiosInstance.get('/users/get-saved-user');
      return useDelay(result, 500, false);
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);
export const forgetMe = createAsyncThunk('forgetMe', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/users/forget-me');
    // toast.success(response?.data?.message);
    return useDelay(response, 900, false);
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.authStatus = false;
        state.userData = null;
        state.error = action.payload;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.authStatus = false;
        state.userData = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgetMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetMe.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgetMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSavedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getSavedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.authStatus = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.authStatus = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateAccountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getUserChannelProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChannelProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfileData = action.payload;
        state.error = null;
      })
      .addCase(getUserChannelProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.watchHistory = action.payload;
        state.error = null;
      })
      .addCase(getWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.userData = action.payload.userResponse;
        state.authStatus = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.authStatus = false;
        state.error = action.payload || 'Failed to refresh token';
      });
  },
});

export default userSlice.reducer;
