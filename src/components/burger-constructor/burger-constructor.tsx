import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { createOrder, closeModal } from '../../components/routers/ordersSlice'; // Экшен для закрытия модального окна
import {
  selectOrderModalData,
  selectOrderRequest
} from '../../components/routers/selectors';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectorConstructor,
  clearConstructor
} from '../routers/constructorSlice';

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
      )
    ];
    console.log('ids', ingredientIds);
    dispatch(createOrder(ingredientIds)); // Отправляем идентификаторы ингредиентов
  };

  // Обработка закрытия модального окна с информацией о заказе
  const closeOrderModal = () => {
    dispatch(clearConstructor());
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
