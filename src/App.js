import React, { useEffect, useState } from 'react';
import { Admin, Resource } from 'react-admin';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { FirebaseDataProvider } from 'react-admin-firebase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress'; // Importación del componente CircularProgress

import Login from './components/Login';
import Register from './components/Register';
import IdentificacionForm from './components/IdentificacionForm';
import PlacaForm from './components/PlacaForm';
import ChasisForm from './components/ChasisForm';
import PropiedadForm from './components/PropiedadForm';
import ClientesForm from './components/ClientesForm';
import VehiculosForm from './components/VehiculosForm';
import CustomMenu from './components/CustomMenu';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7986cb', // Nuevo color primario para la AppBar
    },
    secondary: {
      main: '#4db6ac', // Nuevo color secundario
    },
    background: {
      default: '#fafafa', // Nuevo color de fondo
    },
  },
});

const AdminComponent = () => {
  const dataProvider = FirebaseDataProvider({}, auth);

  return (
    <Admin dataProvider={dataProvider} menu={CustomMenu}>
      <Resource name="identificacionForm" options={{ label: 'Buscar por Identificación' }} list={IdentificacionForm} />
      <Resource name="vehiculosForm" options={{ label: 'Buscar Vehiculos' }} list={VehiculosForm} />
      <Resource name="placaForm" options={{ label: 'Buscar por Placa' }} list={PlacaForm} />
      <Resource name="chasisForm" options={{ label: 'Buscar por Chasis' }} list={ChasisForm} />
      <Resource name="propiedadForm" options={{ label: 'Buscar por Propiedad' }} list={PropiedadForm} />
      <Resource name="clientes" options={{ label: 'Consulta Clientes' }} list={ClientesForm} />
    </Admin>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> {/* Spinner de carga */}
      </div>
    );
  }

  return (
    <Router basename="/datos">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={authenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/*" element={authenticated ? <AdminComponent /> : <Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
