import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { validateEmail } from '@/services/api/validationApi';
import type { EmailValidationResult } from '@/features/validation/types';

interface ValidationState {
  lastEmail: string;
  lastResult: EmailValidationResult | null;
  busy: boolean;
}

const initialState: ValidationState = {
  lastEmail: 'sarah.chen@stripe.com',
  lastResult: null,
  busy: false,
};

export const validateEmailThunk = createAsyncThunk<EmailValidationResult, string>(
  'validation/validateEmail',
  async (email: string) => {
    return await validateEmail(email);
  }
);

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setLastEmail: (state, action: PayloadAction<string>) => {
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
