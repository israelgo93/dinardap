import React from 'react';
import { Sidebar, MenuItemLink, useTranslate } from 'react-admin';
import { styled } from '@mui/system';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { auth } from "../firebase";

const LogoutItem = styled(MenuItemLink)({
    position: 'absolute',
    bottom: '0px',
});

const CustomSidebar = (props) => {
    const translate = useTranslate();
    return (
        <Sidebar {...props}>
            <div>
                <MenuItemLink
                    to="/profile"
                    primaryText={translate('Profile')}
                    leftIcon={<PersonIcon />}
                />
                <LogoutItem
                    to="/"
                    primaryText={translate('Sign out')}
                    leftIcon={<ExitToAppIcon />}
                    onClick={() => {
                        auth.signOut().then(() => {
                            console.log('Signed Out');
                        }, (error) => {
                            console.error('Sign Out Error', error);
                        });
                    }}
                />
            </div>
        </Sidebar>
    );
};

export default CustomSidebar;

