import { useContext, useState } from "react";
import { UserContext } from "../../../../Hooks/UserContext";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import CustomMenu from "./CustomMenu";
function UserMenu() {
    const { userLogedIn, setUserLogedIn, loginUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [userAnchorEl, setUserAnchorEl] = useState(null);

    const handleUserMenuOpen = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserAnchorEl(null);
    };

    const userMenuItems = userLogedIn
        ? [
            { label: 'Profile', action: 'profile' },
            { label: 'My Order', action: 'myOrder' },
            { label: 'Logout', action: 'logout' }
        ]
        : [
            { label: 'Log In', action: 'login' },
            { label: 'Sign Up', action: 'signUp' }
        ];

    const userMenuActions = {
        profile: () => navigate('/user-profile'),
        myOrder: () => navigate('/track-order'),
        logout: () => {
            setUserLogedIn(false);
            navigate('/');
        },
        login: () => navigate('/login'),
        signUp: () => navigate('/sign-up')
    };
  return (
    <>
        <Avatar 
            src={userLogedIn && loginUser?.userProfilePic}
            alt="User Profile" 
            onClick={handleUserMenuOpen} 
            className="cursor-pointer"
        />
        <CustomMenu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleUserMenuClose}
            menuItems={userMenuItems}
            menuActions={userMenuActions}
            withDivider
        />
    </>
  )
}

export default UserMenu