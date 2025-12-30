import { configureStore } from '@reduxjs/toolkit';
import testResultReducer from './slices/testResultSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    testResult: testResultReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

