import { Preloader } from '@ui';
import { useAppSelector } from '../../slices/hooks';
import { selectCheckUser, selectUserName } from '../../slices/selectors';
import { selectUserStatus } from '../../slices/selectors';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  children: React.ReactNode;
  isPublic?: boolean;
};

function ProtectedRoute({ children, isPublic }: ProtectedRouteProps) {
  const user = useAppSelector(selectUserName);
  const checkUser = useAppSelector(selectCheckUser);
  const location = useLocation();

  if (!checkUser) {
    return <Preloader />;
  }

  if (isPublic && user) {
    const from = location.state?.from || { pathname: '/' };
    console.log(from);

    return (
      <Navigate to={from} state={{ background: from?.state?.background }} />
    );
  }

  if (!isPublic && !user) {
    return (
      <Navigate
        to='/login'
        state={{
          from: location
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
