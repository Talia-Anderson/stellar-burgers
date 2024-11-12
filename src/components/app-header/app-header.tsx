import { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppHeaderUI } from '@ui';
import { selectUserName } from '../../slices/selectors'; // Импортируем селектор

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName); // Получаем имя пользователя из стора

  return <AppHeaderUI userName={userName} />;
};
