import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../utils/cookie'; // Используем функцию для получения куки
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

export const ProtectedRoute = () => {
  const token = getCookie('accessToken');
  const { status } = useSelector((state: RootState) => state.user); // Проверяем статус авторизации

  // Если токен отсутствует и статус не "loading", перенаправляем на страницу логина
  if (!token && status !== 'loading') {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};
