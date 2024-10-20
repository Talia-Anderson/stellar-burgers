import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api'; // Импорт API
import { TOrder } from '../../utils/types';

interface FeedsState {
  orders: TOrder[]; // Добавляем для списка заказов
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  orders: [], // Инициализируем список заказов
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Асинхронный thunk для получения списка заказов (новая функция)
export const fetchFeeds = createAsyncThunk<
  any, // Тип возвращаемого значения
  void, // Тип аргумента
  { rejectValue: string } // Тип ошибки
>('feeds/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    console.log(response);
    return response; // Возвращаем список заказов
  } catch (error) {
    return rejectWithValue('Failed to fetch orders');
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectorFeeds: (state) => ({
      orders: state.orders,
      total: state.total,
      totalToday: state.totalToday
    }),
    selectorFeedsOrder: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      // Обработка создания нового заказа
      // Обработка получения списка заказов (новый функционал)
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total; // Сохраняем список заказов
        state.totalToday = action.payload.totalToday; // Сохраняем список заказов
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  }
});
export const { selectorFeeds, selectorFeedsOrder } = feedsSlice.selectors;
export default feedsSlice.reducer;
