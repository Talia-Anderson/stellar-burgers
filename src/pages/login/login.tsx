import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../components/routers/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserStatus } from '../../components/routers/selectors';
import { AppDispatch } from 'src/services/store';
import { setCookie } from '../../utils/cookie'; // Импорт функции для работы с куками

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const userStatus = useSelector(selectUserStatus); // Селектор статуса

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      // Диспатчим экшен для логина
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        const { accessToken } = resultAction.payload;

        // Сохраняем токен в куки с экспирацией на 1 час
        setCookie('accessToken', accessToken, { expires: 3600 });
        console.log('accessToken',accessToken)
        setErrorText(null);
        // Перенаправляем на страницу профиля после успешного логина
        navigate('/profile');
      } else {
        setErrorText('Произошла ошибка. Попробуйте снова.');
      }
    } catch (error) {
      setErrorText('Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <LoginUI
      errorText={
        errorText || (userStatus === 'succeeded' ? 'Вы успешно вошли!' : '')
      }
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
