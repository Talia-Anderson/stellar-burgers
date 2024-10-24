import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../slices/userSlice';
import { selectUserName, selectUserEmail } from '../../slices/selectors';
import { AppDispatch } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Типизированный dispatch
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);

  const [formValue, setFormValue] = useState({
    name: userName,
    email: userEmail,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName || '',
      email: userEmail || ''
    }));
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== userName ||
    formValue.email !== userEmail ||
    !!formValue.password;

  // Обработка сохранения измененных данных пользователя
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      // Диспатчим обновленные данные пользователя
      await dispatch(
        updateUser({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password
        })
      ).unwrap(); // unwrap для обработки ошибок и успеха
      alert('Данные успешно обновлены!');
    } catch (error) {
      alert('Произошла ошибка при обновлении данных.');
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userName,
      email: userEmail,
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
