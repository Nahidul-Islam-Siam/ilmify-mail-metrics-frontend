'use client';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import type { ChildrenProps } from '../types/rbac';

export default function StoreProvider({ children }: ChildrenProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
