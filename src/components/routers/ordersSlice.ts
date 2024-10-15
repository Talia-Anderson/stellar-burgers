import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface OrdersState {
  order: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  order: null,
  orders: [],
  loading: false,
  error: null
};

// Асинхронный thunk для создания нового заказа
export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orders/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  } catch (error) {
    return rejectWithValue('Failed to create order');
  }
});

// Асинхронный thunk для получения данных о заказе по номеру
export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (response.orders.length === 0) {
      return rejectWithValue('Order not found');
    }
    return response.orders[0];
  } catch (error) {
    return rejectWithValue('Failed to fetch order');
  }
});

// Обновленный слайс с дополнительными функциями
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  }
});

export default ordersSlice.reducer;
