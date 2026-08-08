'use client';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  markInitialized,
  restoreSessionThunk,
  selectRestorableTokens,
} from '@/redux/features/auth/authSlice';
import { makeStore } from '@/redux/store';
import type { ChildrenProps } from '@/features/auth/types';

function AuthBootstrap({ children }: ChildrenProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    localStorage.removeItem('mm_access_token');
    localStorage.removeItem('mm_refresh_token');
    localStorage.removeItem('mm_token');
    const tokens = selectRestorableTokens(auth);
    if (tokens) void dispatch(restoreSessionThunk(tokens));
    else dispatch(markInitialized());
  }, [auth, dispatch]);

  return children;
}

export default function ReduxProvider({ children }: ChildrenProps) {
  const [store] = useState(makeStore);
  const [persistor] = useState(() => persistStore(store));

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </PersistGate>
    </Provider>
  );
}
