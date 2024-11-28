import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';
import constructorReducer from '../slices/constructorSlice';
import feedsReducer from '../slices/feedSlice';
import userReducer from '../slices/userSlice';
import { rootReducer } from './store';

// Импортируем начальные состояния для всех редьюсеров
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as ordersInitialState } from '../slices/ordersSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as feedsInitialState } from '../slices/feedSlice';
import { initialState as userInitialState } from '../slices/userSlice';

describe('rootReducer инициализация', () => {
  test('rootReducer должен инициализировать корректно', () => {
    // Получаем начальное состояние для корневого редьюсера
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем начальные состояния для каждого из под-редьюсеров
    expect(initialState.ingredients).toEqual(ingredientsInitialState);
    expect(initialState.orders).toEqual(ordersInitialState);
    expect(initialState.burgerConstructor).toEqual(constructorInitialState);
    expect(initialState.feeds).toEqual(feedsInitialState);
    expect(initialState.user).toEqual(userInitialState);
  });
});
