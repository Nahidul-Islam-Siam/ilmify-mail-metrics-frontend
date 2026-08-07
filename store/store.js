import { configureStore } from '@reduxjs/toolkit';
import validationReducer from './validationSlice';

export const store = configureStore({
  reducer: {
    validation: validationReducer,
  },
});
