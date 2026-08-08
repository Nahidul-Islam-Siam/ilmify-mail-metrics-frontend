import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import authReducer from './features/auth/authSlice';
import { authPersistConfig } from './features/auth/authPersist';
import validationReducer from './features/validation/validationSlice';

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export function makeStore() {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
      validation: validationReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
