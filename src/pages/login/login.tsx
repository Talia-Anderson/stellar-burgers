import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../components/routers/userSlice';
import { Link } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch(); // Используем dispatch
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      // Диспатчим экшен для логина
      await loginUser({ email, password });

      setIsSuccess(true);
      setErrorText(null);
      <Link to='/' />;
    } catch (error) {
      setErrorText('Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <LoginUI
      errorText={errorText || (isSuccess ? 'Вы успешно вошли!' : '')}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
