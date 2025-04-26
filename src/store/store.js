import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice.js';
import videoReducer from './Slices/videoSlice.js';
import tweetReducer from './Slices/tweetSlice.js';
import commentReducer from './Slices/commentSlice.js';
import subscriptionReducer from './Slices/subscriptionSlice.js';
import dashboardReducer from './Slices/dashboardSlice.js';
import likeReducer from './Slices/likeSlice.js';
import playlistReducer from './Slices/playlistSlice.js';
import backgroundReducer from './Slices/backgroundSlice.js';
import themeReducer from './Slices/themeSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
    tweet: tweetReducer,
    comment: commentReducer,
    subscription: subscriptionReducer,
    dashboard: dashboardReducer,
    like: likeReducer,
    playlist: playlistReducer,
    background: backgroundReducer,
    theme: themeReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('background', JSON.stringify(state.background));
  localStorage.setItem('theme', JSON.stringify(state.theme));
});

export default store;
