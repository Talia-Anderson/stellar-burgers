import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '../utils/burger-api';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

interface OrdersState {
  order: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  orderByNumber: any;
  isModalOpen: boolean; // Добавляем состояние для контроля модального окна
}

const initialState: OrdersState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  orderByNumber: null,
  isModalOpen: false // Изначально модальное окно закрыто
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

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi(); // Используем API для получения заказов
    return orders;
  } catch (error) {
    return rejectWithValue('Failed to fetch orders');
  }
});

// Удаляем дублирующий thunk `getOrderByNumber`
// Так как `fetchOrderByNumber` уже выполняет эту задачу

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.order = null;
      state.isModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.isModalOpen = true;
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
        state.orderByNumber = action.payload;
        state.isModalOpen = true; // Можно сразу открывать модальное окно
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Order not found';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });
  }
});

// Экшены для открытия и закрытия модального окна
export const { openModal, closeModal } = ordersSlice.actions;

export default ordersSlice.reducer;
