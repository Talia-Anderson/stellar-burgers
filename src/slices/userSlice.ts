import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, loginUserApi, updateUserApi } from '../utils/burger-api'; // Апи-функции
import { setCookie, deleteCookie } from '../utils/cookie';
import { TUser } from '@utils-types';

export type UserState = {
  data: TUser | null;
  password?: string;
  checkUser: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export const initialState: UserState = {
  data: null,
  password: '',
  status: 'idle',
  checkUser: false
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { name: string; email: string; password?: string }) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

// Добавляем экшен для логина
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: { email: string; password: string }) => {
    const response = await loginUserApi(loginData);
    // Сохраняем токены в localStorage и куки
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return {
      name: response.user.name,
      email: response.user.email
    };
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    // Удаляем токены
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    checkedUserAuth: (state) => {
      state.checkUser = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.password = ''; // Сбрасываем пароль после обновления
        state.status = 'succeeded';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.data = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      });
  }
});
export const { checkedUserAuth } = userSlice.actions;
export default userSlice.reducer;
