import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserStatus } from '../../slices/selectors';
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
        
        setErrorText(null);
        // Перенаправляем на страницу конструктора после успешного логина
        navigate('/');
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
