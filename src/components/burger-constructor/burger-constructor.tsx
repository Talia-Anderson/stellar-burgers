import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { createOrder, closeModal } from '../../slices/ordersSlice'; // Экшен для закрытия модального окна
import {
  selectOrderModalData,
  selectOrderRequest,
  selectUserEmail
} from '../../slices/selectors';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectorConstructor,
  clearConstructor
} from '../../slices/constructorSlice';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { RootState } from '../../services/store'; // Импортируем тип RootState для селектора
import { selectUserStatus } from '../../slices/selectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для навигации

  // Получаем данные из Redux-хранилища
  const constructorItems = useSelector(selectorConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  // Получаем статус пользователя
  const email = useSelector(selectUserEmail);
  const status = useSelector(selectUserStatus);

  // Обработка клика на кнопку заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверяем авторизацию
    if (!email || status !== 'succeeded') {
      navigate('/login'); // Перенаправляем на страницу логина
      return;
    }

    // Диспатч экшена для создания заказа через API
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];
    console.log('ids', ingredientIds);
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => dispatch(clearConstructor()))
      .catch(() => console.log('Ошибка создания заказа'));
  };

  // Обработка закрытия модального окна с информацией о заказе
  const closeOrderModal = () => {
    dispatch(closeModal()); // Закрываем модальное окно через Redux
  };

  // Подсчет итоговой цены заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );
  console.log(constructorItems.ingredients.length);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal} // Передаем функцию закрытия модального окна
    />
  );
};
