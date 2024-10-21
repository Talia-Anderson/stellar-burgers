import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from '../slices/userSlice';

import { combineReducers } from '@reduxjs/toolkit';
import constructorReducer from '../slices/constructorSlice'; // Import the constructor reducer
import feedsReducer from '../slices/feedSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';

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
