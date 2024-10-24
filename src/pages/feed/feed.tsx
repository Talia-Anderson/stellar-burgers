import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectorFeedsOrder } from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders = useSelector(selectorFeedsOrder);
  console.log(' orders', orders);
  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
