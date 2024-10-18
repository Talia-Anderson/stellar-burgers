import { FC, memo, useState } from 'react';

import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { getFeedsApi } from '@api'; // Импортируем API для фида

export const FeedUI: FC<FeedUIProps> = memo(({ orders: initialOrders}) => {
  const [orders, setOrders] = useState(initialOrders);

  const handleGetFeeds = async () => {
    try {
      const data = await getFeedsApi();
      setOrders(data.orders); // Обновляем состояние с новыми заказами
    } catch (error) {
      console.error('Error fetching feeds:', error);
      // Можно добавить обработку ошибок (уведомление пользователя)
    }
  };

  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text="Обновить"
          onClick={handleGetFeeds} // Привязываем функцию обновления
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  );
});
