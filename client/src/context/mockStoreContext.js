import { createContext } from 'react';

// Kept in its own module so MockStore.jsx only exports components
// (React Fast Refresh friendly).
export const MockStoreContext = createContext(null);
