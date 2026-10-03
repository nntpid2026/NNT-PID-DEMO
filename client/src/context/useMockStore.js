import { useContext } from 'react';
import { MockStoreContext } from './mockStoreContext';

export const useMockStore = () => {
  const ctx = useContext(MockStoreContext);
  if (!ctx) throw new Error('useMockStore must be used inside MockStoreProvider');
  return ctx;
};
