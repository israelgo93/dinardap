import React, { useEffect, useState } from 'react';
import { Admin, Resource } from 'react-admin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Login from './components/Login';
import Register from './components/Register';
import IdentificacionForm from './components/IdentificacionForm';
import PlacaForm from './components/PlacaForm';
import ChasisForm from './components/ChasisForm';
import PropiedadForm from './components/PropiedadForm';
import ClientesForm from './components/ClientesForm';
import VehiculosForm from './components/VehiculosForm';

// Importar CustomAppBar y ProfilePage aquí
import CustomAppBar from './components/CustomAppBar';
import ProfilePage from './components/ProfilePage';
 
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
    return <h2>Cargando...</h2>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Agregar ruta para la página de perfil aquí */}
        <Route path="*" element={authenticated ? (
          <Admin appBar={CustomAppBar}> {/* Usa CustomAppBar aquí */}
            <Resource name="identificacionForm" options={{ label: 'Buscar por Identificación' }} list={IdentificacionForm} />
            <Resource name="vehiculosForm" options={{ label: 'Buscar Vehiculos' }} list={VehiculosForm} />
            <Resource name="placaForm" options={{ label: 'Buscar por Placa' }} list={PlacaForm} />
            <Resource name="chasisForm" options={{ label: 'Buscar por Chasis' }} list={ChasisForm} />
            <Resource name="propiedadForm" options={{ label: 'Buscar por Propiedad' }} list={PropiedadForm} />
            <Resource name="clientes" options={{ label: 'Consulta Clientes' }} list={ClientesForm} />
          </Admin>
        ) : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
