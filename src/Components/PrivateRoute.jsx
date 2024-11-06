// src/Components/Common/PrivateRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';


const PrivateRoute = ({ element }) => {
  const { userLogedIn } = useContext(UserContext);

  return userLogedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
