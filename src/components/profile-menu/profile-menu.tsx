import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../components/routers/userSlice';
import { AppDispatch } from '../../services/store';
import { logoutApi } from '@api'; // API для логаута
import { deleteCookie } from '../../utils/cookie'; // Удаление куки

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi(); // Вызов API логаута
      deleteCookie('accessToken'); // Удаление accessToken
      localStorage.removeItem('refreshToken'); // Удаление refreshToken

      await dispatch(logoutUser()); // Обновление стора

      navigate('/login'); // Редирект на страницу логина
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
