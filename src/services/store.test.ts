import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';
import constructorReducer from '../slices/constructorSlice';
import feedsReducer from '../slices/feedSlice';
import userReducer from '../slices/userSlice';
import { combineReducers } from '@reduxjs/toolkit';

// Импортируем rootReducer
import { rootReducer } from './store';

describe('rootReducer инициализация', () => {
  test('rootReducer должен инициализировать корректно', () => {
    // Получаем начальное состояние для корневого редьюсера
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем начальные состояния для каждого из под-редьюсеров
    expect(initialState.ingredients).toEqual(ingredientsReducer(undefined, { type: '@@INIT' }));
    expect(initialState.orders).toEqual(ordersReducer(undefined, { type: '@@INIT' }));
    expect(initialState.burgerConstructor).toEqual(constructorReducer(undefined, { type: '@@INIT' }));
    expect(initialState.feeds).toEqual(feedsReducer(undefined, { type: '@@INIT' }));
    expect(initialState.user).toEqual(userReducer(undefined, { type: '@@INIT' }));
  });
});
