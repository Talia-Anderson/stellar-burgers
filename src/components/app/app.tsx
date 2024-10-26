import { AppHeader } from '@components';
import { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
  useMatch
} from 'react-router-dom';
import '../../index.css';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '../../pages';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { fetchFeeds } from '../../slices/feedSlice';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { fetchUser } from '../../slices/userSlice';
import { Preloader } from '../ui/preloader';
import styles from './app.module.css';
import { getCookie } from '../../utils/cookie';
import ProtectedRoute from '../protected-route/protectedRoute';
import { fetchOrders } from '../../slices/ordersSlice';
import { checkedUserAuth } from '../../slices/userSlice';

const App = () => (
  <Router>
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  </Router>
);

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profileMatch = useMatch('profile/orders/:number')?.params.number;
  const feedMatch = useMatch('feed/:number')?.params.number;
  const ordersNumber = profileMatch || feedMatch;

  const ingredientsLoading = useAppSelector(
    (state) => state.ingredients.isLoading
  );

  // Определение фона для модальных окон
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser())
      .unwrap()
      .catch(() => console.log('Ошибка загрузки пользователя'))
      .finally(() => dispatch(checkedUserAuth()));
  }, [dispatch]);

  // Закрытие модального окна
  const closeModal = () => {
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  if (ingredientsLoading) {
    return <Preloader />; // Показываем лоадер, пока загружаются данные
  }

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />

        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute isPublic>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute isPublic>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute isPublic>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute isPublic>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Модальные маршруты */}
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #{ordersNumber && ordersNumber.padStart(6, '0')}
              </p>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали заказа
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #{ordersNumber && ordersNumber.padStart(6, '0')}
              </p>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали заказа
              </p>
              <OrderInfo />
            </div>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Рендер модальных окон на фоне */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${ordersNumber}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={`#${ordersNumber}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
