import * as React from 'react';
import { AppBar, UserMenu, useTranslate } from 'react-admin';
import { MenuItemLink } from 'react-admin';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { auth } from './firebase';

const CustomUserMenu = (props) => {
    const translate = useTranslate();
    return (
        <UserMenu {...props}>
            <MenuItemLink
                to="/profile"
                primaryText={translate('ra.my_profile')}
                leftIcon={<PersonIcon />}
            />
            <MenuItemLink
                onClick={() => auth.signOut()}
                primaryText={translate('ra.auth.logout')}
                leftIcon={<ExitToAppIcon />}
            />
        </UserMenu>
    );
};

const CustomAppBar = (props) => <AppBar {...props} userMenu={<CustomUserMenu />} />;

export default CustomAppBar;
