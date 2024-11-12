import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi, TRegisterData } from '@api';
import { setCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };
    console.log('User data:', userData); // Лог для проверки отправляемых данных

    try {
      const response = await registerUserApi(userData);
      // Сохраняем токены в куки
      setCookie('accessToken', response.accessToken, { expires: 3600 }); // токен с истечением через 1 час
      localStorage.setItem('refreshToken', response.refreshToken); // сохраняем refresh токен в localStorage
      // После успешной регистрации перенаправляем пользователя в личный кабинет
      navigate('/profile');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
