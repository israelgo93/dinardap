import * as React from 'react';
import { MenuItemLink, useTranslate, useLogout } from 'react-admin';
import { ListItemIcon, Typography, MenuItem } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';

const CustomUserMenu = (props) => {
    const translate = useTranslate();
    const logout = useLogout();

    return (
        <div {...props}>
            <MenuItemLink
                to="/profile"
                primaryText={translate('ra.my_profile')}
                leftIcon={<PersonIcon />}
            />
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <Typography variant="inherit">
                    {translate('ra.auth.logout')}
                </Typography>
            </MenuItem>
        </div>
    );
};

export default CustomUserMenu;
