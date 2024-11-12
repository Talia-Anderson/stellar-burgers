import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders } from '../../slices/selectors';
import { getOrdersApi } from '../../utils/burger-api'; // Импортируем API для получения заказов
import { useAppDispatch } from '../../slices/hooks';
import { fetchOrders } from '../../slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useSelector(selectOrders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
