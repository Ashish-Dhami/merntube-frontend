import { createSlice } from '@reduxjs/toolkit';
import Theme from '../../enums/Theme';

const savedState = localStorage.getItem('theme');
const initialState = savedState
  ? JSON.parse(savedState)
  : { value: Theme.FOREST };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
