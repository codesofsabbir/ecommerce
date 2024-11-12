import { PiHeadsetFill } from 'react-icons/pi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomMenu from './CustomMenu'; // Import CustomMenu

function HelpIconMenu() {
    const [helpAnchorEl, setHelpAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleHelpLineOpen = (event) => {
        setHelpAnchorEl(event.currentTarget);
    }

    const handleHelpLineClose = () => {
        setHelpAnchorEl(null);
    };

    const menuItems = [
        { label: '+880 1303 142498', action: 'call' },
        { label: 'Help Center', action: 'helpCenter' }
    ];

    const menuActions = {
        call: () => {},
        helpCenter: () => navigate('/help-center')
    };

    return (
        <>
            <PiHeadsetFill
                onClick={handleHelpLineOpen}
                className="cursor-pointer text-3xl"
            />
            <CustomMenu
                anchorEl={helpAnchorEl}
                open={Boolean(helpAnchorEl)}
                onClose={handleHelpLineClose}
                menuItems={menuItems}
                menuActions={menuActions}
            />
        </>
    );
}

export default HelpIconMenu;
