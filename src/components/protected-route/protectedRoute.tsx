import { useEffect } from 'react';
import { useAppSelector } from '../routers/hooks';
import { useNavigate, Navigate, Outlet, Link } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { fetchUser } from '../routers/userSlice';
import { useAppDispatch } from '../routers/hooks';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  redirectTo?: string;
};

export const ProtectedRoute = ({
  redirectTo = '/register'
}: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { name, status } = useAppSelector((state) => state.user);
  const accessToken = getCookie('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate(redirectTo);
    } else {
      if (status === 'idle') {
        dispatch(fetchUser()).catch(() => navigate(redirectTo));
      }
    }
  }, [accessToken, status, dispatch, navigate, redirectTo]);

  if (status === 'loading') {
    return <Preloader />; // Можно заменить на компонент загрузки
  }

  // Если пользователь не авторизован, редиректим его на страницу регистрации
  if (!name) {
    return <Navigate to={redirectTo} />;
  }

  // Если авторизация прошла успешно, рендерим дочерние элементы
  return <Outlet />;
};
