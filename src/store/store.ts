import { configureStore } from '@reduxjs/toolkit';

// We'll add slices later
export const store = configureStore({
  reducer: {
    placeholder: (state = {}, action) => state,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
