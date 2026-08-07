import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { validateEmail } from '../lib/api';

export const validateEmailThunk = createAsyncThunk(
  'validation/validateEmail',
  async (email) => {
    return await validateEmail(email);
  }
);

const validationSlice = createSlice({
  name: 'validation',
  initialState: {
    lastEmail: 'sarah.chen@stripe.com',
    lastResult: null,
    busy: false,
  },
  reducers: {
    setLastEmail: (state, action) => {
      state.lastEmail = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateEmailThunk.pending, (state) => {
        state.busy = true;
      })
      .addCase(validateEmailThunk.fulfilled, (state, action) => {
        state.busy = false;
        state.lastResult = action.payload;
      })
      .addCase(validateEmailThunk.rejected, (state) => {
        state.busy = false;
      });
  },
});

export const { setLastEmail } = validationSlice.actions;
export default validationSlice.reducer;
