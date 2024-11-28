import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

function Protected() {
    const { userLogedIn } = useContext(UserContext);
    if(!userLogedIn) {
        return <Navigate to="/login" />;
    }
    return <Outlet />
}

export default Protected