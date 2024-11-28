import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../Hooks/UserContext';

function Protected() {
    const { adminLogIn } = useContext(UserContext);
    if(!adminLogIn) {
        return <Navigate to="/admin" />;
    }
    return <Outlet />
}

export default Protected