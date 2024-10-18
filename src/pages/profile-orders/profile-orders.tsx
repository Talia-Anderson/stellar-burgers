import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders } from '../../components/routers/selectors';
import { getOrdersApi } from '../../utils/burger-api'; // Импортируем API для получения заказов


export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);


  return <ProfileOrdersUI orders={orders} />;
};
