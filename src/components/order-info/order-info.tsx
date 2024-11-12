import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  orderDataSelector,
  ingredientsDataSelector
} from '../../slices/selectors'; // Импорт селекторов
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../slices/ordersSlice';

export const OrderInfo: FC = () => {
  const number = useParams().number || '';
  // Получаем данные заказа и ингредиентов из стора
  const orderData = useSelector(orderDataSelector(number));
  const ingredients = useSelector(ingredientsDataSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(+number));
    }
  }, [dispatch, orderData, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Подсчет количества ингредиентов в заказе
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    // Подсчет общей суммы заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
