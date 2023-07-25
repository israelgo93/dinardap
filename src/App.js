import React, { useEffect, useState } from 'react';
import { Admin, Resource } from 'react-admin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { FirebaseDataProvider } from 'react-admin-firebase';

import Login from './components/Login';
import Register from './components/Register';
import IdentificacionForm from './components/IdentificacionForm';
import PlacaForm from './components/PlacaForm';
import ChasisForm from './components/ChasisForm';
import PropiedadForm from './components/PropiedadForm';
import ClientesForm from './components/ClientesForm';
import VehiculosForm from './components/VehiculosForm';

import CustomAppBar from './components/CustomAppBar';
import ProfilePage from './components/ProfilePage';
import CustomSidebar from './components/CustomSidebar';  // Import the CustomSidebar

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

  const dataProvider = FirebaseDataProvider({}, auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={authenticated ? (
          <Admin appBar={CustomAppBar} sidebar={CustomSidebar} dataProvider={dataProvider}>
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
