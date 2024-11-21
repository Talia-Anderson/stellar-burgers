import feedsReducer, { FeedsState, fetchFeeds } from './feedSlice'; // Импорт вашего редьюсера и типов

describe('Тест FeedsSlice', () => {
  test('Тест fetchFeeds.fulfilled', () => {
    // Инициализируем начальное состояние
    const initialState: FeedsState = {
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    };

    // Заготовка для payload, которую вернет fulfilled action
    const payload = {
      orders: [{ id: '123', name: 'Order 1' }, { id: '456', name: 'Order 2' }], // Пример списка заказов
      total: 100,
      totalToday: 10
    };

    // Выполняем экшен fulfilled
    const newState = feedsReducer(
      initialState,
      fetchFeeds.fulfilled(payload, '', undefined)
    );

    // Проверяем обновления в состоянии
    expect(newState.orders).toEqual(payload.orders);
    expect(newState.total).toEqual(payload.total);
    expect(newState.totalToday).toEqual(payload.totalToday);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });
});
