import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserName,
  selectUserEmail
} from '../../components/routers/selectors';
import { updateUser } from '../../components/routers/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch(); // Используем типизированный dispatch

  // Получаем данные пользователя из стора
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);

  const [formValue, setFormValue] = useState({
    name: name || '',
    email: email || '',
    password: ''
  });

  // Обновляем состояние формы при изменении данных пользователя
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: name || '',
      email: email || ''
    }));
  }, [name, email]);

  const isFormChanged =
    formValue.name !== name ||
    formValue.email !== email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    updateUser(formValue);
    console.log(formValue); // Обновляем данные пользователя
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: name,
      email: email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
