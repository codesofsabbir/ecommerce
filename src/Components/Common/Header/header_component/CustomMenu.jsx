/* eslint-disable react/prop-types */
import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';

function CustomMenu({
    anchorEl,
    open,
    onClose,
    menuItems,
    menuActions,
    withDivider = false
}) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            className="mt-5"
        >
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    <MenuItem onClick={menuActions[item.action]}>
                        {item.label}
                    </MenuItem>
                    {withDivider && index === menuItems.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Menu>
    );
}

export default CustomMenu;
