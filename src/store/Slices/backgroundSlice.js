import { createSlice } from '@reduxjs/toolkit';
import Background from '../../enums/Background';

const savedState = localStorage.getItem('background');
const initialState = savedState
  ? JSON.parse(savedState)
  : { value: Background.PLAIN };

const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    changeBackground: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeBackground } = backgroundSlice.actions;
export default backgroundSlice.reducer;
