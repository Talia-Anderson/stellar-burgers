import { configureStore, combineReducers } from '@reduxjs/toolkit'; // combineReducers нужно для объединения редьюсеров
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from '../slices/userSlice';
import constructorReducer from '../slices/constructorSlice';
import feedsReducer from '../slices/feedSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';

// Создаем rootReducer с помощью combineReducers
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  burgerConstructor: constructorReducer,
  feeds: feedsReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
