import { AppHeader } from '@components';
import { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useLocation,
  Navigate
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
import { ProtectedRoute } from '../protected-route/protectedRoute';
import { fetchOrders } from '../../slices/ordersSlice';

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

  const ingredientsLoading = useAppSelector(
    (state) => state.ingredients.isLoading
  );
  const orderLoading = useAppSelector((state) => state.orders.loading);
  const user = useAppSelector((state) => state.user);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);

  // Определение фона для модальных окон
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(fetchUser());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    // Проверка наличия токена и статуса пользователя
    const token = getCookie('accessToken');
    if (token && user.status === 'succeeded') {
      setIsUserAuthenticated(true);
    } else {
      setIsUserAuthenticated(false);
    }
  }, [user]);

  // Закрытие модального окна
  const closeModal = () => {
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  if (ingredientsLoading || orderLoading) {
    return <Preloader />; // Показываем лоадер, пока загружаются данные
  }

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />

        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            isUserAuthenticated ? <Profile /> : <Navigate to='/register' />
          }
        />
        <Route
          path='/profile/orders'
          element={
            isUserAuthenticated ? (
              <ProfileOrders />
            ) : (
              <Navigate to='/register' />
            )
          }
        />

        {/* Модальные маршруты */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Рендер модальных окон на фоне */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Order Info' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ingredient Details' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Info' onClose={closeModal}>
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
