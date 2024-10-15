import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from '../components/routers/userSlice';

import { combineReducers } from '@reduxjs/toolkit';
import constructorReducer from '../components/routers/constructorSlice'; // Import the constructor reducer
import feedsReducer from '../components/routers/feedSlice';
import ingredientsReducer from '../components/routers/ingredientsSlice';
import ordersReducer from '../components/routers/ordersSlice';

const rootReducer = {
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  burgerConstructor: constructorReducer,
  feeds: feedsReducer,
  user: userReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>; // Получаем тип глобального состояния
export type AppDispatch = typeof store.dispatch; // Типизация dispatch

// Хуки с типизацией
export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
