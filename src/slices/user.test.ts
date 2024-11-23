import reducer, {
  checkedUserAuth,
  fetchUser,
  updateUser,
  loginUser,
  logoutUser,
  UserState
} from './userSlice'; // Импортируем как reducer

import { TUser } from '@utils-types';

describe('userSlice', () => {
  // Применяем тип UserState к initialState
  const initialState: UserState = {
    data: null,
    password: '',
    status: 'idle',
    checkUser: false,
  };

  test('Тест fetchUser fulfilled', () => {
    const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };

    const action = fetchUser.fulfilled(mockUser, '', undefined);
    const state = reducer(initialState, action); // Используем reducer

    expect(state.data).toEqual(mockUser);
    expect(state.status).toEqual('succeeded');
  });

  test('Тест fetchUser pending', () => {
    const action = fetchUser.pending('', undefined);
    const state = reducer(initialState, action); // Используем reducer

    expect(state.status).toEqual('loading');
  });

  test('Тест fetchUser rejected', () => {
    const action = fetchUser.rejected(new Error('Failed'), '', undefined);
    const state = reducer(initialState, action); // Используем reducer

    expect(state.status).toEqual('failed');
  });

  test('Тест updateUser fulfilled', () => {
    const updatedUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const userData = { name: 'Jane Doe', email: 'jane@example.com', password: '' }; // Здесь должно быть передано корректное значение
    const action = updateUser.fulfilled(updatedUser, '', userData); // Передаем userData вместо undefined
    const state = reducer(initialState, action);
  
    expect(state.data).toEqual(updatedUser);
    expect(state.password).toBe('');
    expect(state.status).toEqual('succeeded');
  });

  test('Тест loginUser fulfilled', () => {
    const loginData = { email: 'john@example.com', password: 'password' };
    const action = loginUser.fulfilled(
      {
        name: 'John Doe',
        email: 'john@example.com'
      },
      '',
      loginData
    );
    const state = reducer(initialState, action); // Используем reducer

    expect(state.data).toEqual({ name: 'John Doe', email: 'john@example.com' });
    expect(state.status).toEqual('succeeded');
    //expect(localStorage.getItem('refreshToken')).toBe('token456');

  });

  test('Тест logoutUser fulfilled', () => {
    const action = logoutUser.fulfilled(undefined, '', undefined);
    const state = reducer(initialState, action); // Используем reducer

    expect(state.status).toEqual('succeeded');
    expect(state.data).toBeNull();
    //expect(localStorage.getItem('refreshToken')).toBeNull();

  });
});
