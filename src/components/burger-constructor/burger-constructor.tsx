import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { createOrder } from '../../components/routers/ordersSlice'; // Экшен для создания заказа
import {
  selectOrderModalData,
  selectOrderRequest
} from '../../components/routers/selectors'; // Путь к селекторам
import { useDispatch, useSelector } from '../../services/store';
import { selectorConstructor } from '../routers/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из Redux-хранилища
  const constructorItems = useSelector(selectorConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  console.log(constructorItems);

  // Обработка клика на кнопку заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Диспатч экшена для создания заказа через API
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ) // Явно указываем тип
    ];
    dispatch(createOrder(ingredientIds)); // Отправляем идентификаторы ингредиентов
  };
  const navigate = useNavigate();
  // Обработка закрытия модального окна с информацией о заказе
  const closeOrderModal = () => {
    navigate(-1);
    // Здесь можно вызвать экшен для закрытия модального окна (если потребуется)
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

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
