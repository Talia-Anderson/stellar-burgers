import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, loginUserApi, updateUserApi } from '../utils/burger-api'; // Апи-функции
import { setCookie, deleteCookie } from '../utils/cookie';

type UserState = {
  name: string;
  email: string;
  password?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: UserState = {
  name: '',
  email: '',
  password: '',
  status: 'idle'
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
    return {
      name: response.user.name,
      email: response.user.email,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    };
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  // Удаляем токены
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.status = 'succeeded';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.password = ''; // Сбрасываем пароль после обновления
        state.status = 'succeeded';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.status = 'succeeded';
        // Сохраняем токены в localStorage или куки
        setCookie('accessToken', action.payload.accessToken, { expires: 3600 });
        localStorage.setItem('refreshToken', action.payload.refreshToken);
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
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
      });
  }
});

export default userSlice.reducer;
