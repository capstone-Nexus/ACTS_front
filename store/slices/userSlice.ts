import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/axios';

interface UserData {
  username: string;
  email: string;
  gender: string;
  birth: string;
}

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  isLoading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async () => {
    const response = await API.get('/user/my');
    return response.data.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '사용자 정보 조회 실패';
      });
  },
});

export const { clearUserData, clearError } = userSlice.actions;
export default userSlice.reducer;

