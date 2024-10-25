import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchFeeds, selectorFeedsOrder } from '../../slices/feedSlice';
import { useAppDispatch } from '../../slices/hooks';

export const Feed: FC = () => {
  const orders = useSelector(selectorFeedsOrder);
  console.log(' orders', orders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);
  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
