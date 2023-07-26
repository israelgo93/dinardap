import * as React from "react";
import { signOut } from '../firebase'; // Importar signOut desde firebase/auth
import { auth } from '../firebase'; // Importar auth desde tu archivo firebase
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import LicenseIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import { MenuItem, MenuList } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

const CustomMenuItem = styled(MenuItem)({
  color: "black",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#f0f0f0"
  }
});

const IconMap = {
  "identificacionForm": DescriptionIcon,
  "vehiculosForm": CarRepairIcon,
  "placaForm": LicenseIcon,
  "chasisForm": SearchIcon,
  "propiedadForm": SearchIcon,
  "clientes": PeopleIcon,
};

const CustomMenu = ({ dense = false }) => {
  const menuItems = [
    { name: "identificacionForm", label: "Buscar por Identificación" },
    { name: "vehiculosForm", label: "Buscar Vehiculos" },
    { name: "placaForm", label: "Buscar por Placa" },
    { name: "chasisForm", label: "Buscar por Chasis" },
    { name: "propiedadForm", label: "Buscar por Propiedad" },
    { name: "clientes", label: "Consulta Clientes" },
  ];

  const handleLogout = () => {
    signOut(auth); // Utilizar signOut de Firebase
  }

  return (
    <Box display="flex" flexDirection="column" height="calc(100vh - 40px)">
      <MenuList>
        {menuItems.map((item) => {
          const Icon = IconMap[item.name];
          return (
            <CustomMenuItem component={Link} to={`/${item.name}`} key={item.name}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </CustomMenuItem>
          );
        })}
      </MenuList>
      <Box mt="auto" mb={3}>
        <CustomMenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesion" />
        </CustomMenuItem>
      </Box>
    </Box>
  );
};

export default CustomMenu;
