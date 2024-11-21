import { fetchFeeds } from './feedSlice'; // Импортируем ваш thunk
import { getFeedsApi } from '../utils/burger-api'; // Мокаем API
import { SerializedError } from '@reduxjs/toolkit'; // Импортируем для типизации ошибки
import { PayloadAction } from '@reduxjs/toolkit';
jest.mock('../utils/burger-api'); // Мокаем API

const mockedGetFeedsApi = getFeedsApi as jest.Mock;

describe('fetchFeeds thunk', () => {
  const mockResponse = {
    orders: [{ id: '1', name: 'Order 1', status: 'done' }],
    total: 100,
    totalToday: 10
  };

  test('should dispatch fulfilled action when API call is successful', async () => {
    // Настроим мок для успешного ответа
    mockedGetFeedsApi.mockResolvedValueOnce(mockResponse);

    // Вызываем thunk
    const dispatch = jest.fn();
    const getState = jest.fn();

    // Выполняем thunk
    const result = await fetchFeeds()(dispatch, getState, undefined);

    // Проверяем, что был вызван fulfilled action
    if (result.type === 'feeds/fetchFeeds/fulfilled') {
      expect(result.payload).toEqual(mockResponse);
    } else {
      throw new Error(`Expected fulfilled action, but got ${result.type}`);
    }
  });

  test('should dispatch rejected action when API call fails', async () => {
    // Настроим мок для ошибки
    const testError = new Error('Failed to fetch orders');
    mockedGetFeedsApi.mockRejectedValueOnce(testError);

    // Вызываем thunk
    const dispatch = jest.fn();
    const getState = jest.fn();

    // Выполняем thunk
    const result = await fetchFeeds()(dispatch, getState, undefined);

    // Проверяем, что был вызван rejected action
    if (result.type === 'feeds/fetchFeeds/rejected') {
      // Проверяем, что error присутствует в результате
      const error = result as PayloadAction<
        string | undefined,
        string,
        { arg: void; requestId: string; requestStatus: 'rejected' },
        SerializedError
      >;
      expect(error.error.message).toBe('Failed to fetch orders');
    } else {
      throw new Error(`Expected rejected action, but got ${result.type}`);
    }
  });
});
