import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import { Button, TextField, Container, Typography, Box, Modal, Snackbar, Alert } from '@mui/material';
import styled from 'styled-components';
import validator from 'validator';

const MainWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #00008B 30%, #800080 90%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
`;

const ModalWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth.currentUser && auth.currentUser.emailVerified) {
        window.location.reload();
      }
    }, 5000); // Verifica cada 5 segundos

    // Cleanup para evitar ejecución múltiple
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email)) {
      setErrorMessage('Por favor, introduce un correo electrónico válido');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión: ", error.message);
      setErrorMessage('Correo electrónico o contraseña incorrectos');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(resetEmail)) {
      setErrorMessage('Por favor, introduce un correo electrónico válido');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setOpenModal(false);
      setSnackbarMessage('Se ha enviado el enlace de restablecimiento de contraseña a tu correo electrónico.');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al enviar el enlace de restablecimiento: ", error.message);
      setErrorMessage('Correo electrónico no registrado');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <MainWrapper>
      <Container component="main" maxWidth="xs">
        <FormWrapper>
          <Typography component="h1" variant="h5" gutterBottom>
            PORTAL DINARDAP - EPAM
          </Typography>
          <Typography component="h2" variant="h6">
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errorMessage && (
              <Typography color="error" align="center" variant="body2" gutterBottom>
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Iniciar sesión
            </Button>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
              </Typography>
              <Typography variant="body2" align="center">
                <Link onClick={() => setOpenModal(true)}>¿Olvidaste tu contraseña?</Link>
              </Typography>
            </Box>
          </form>
        </FormWrapper>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <ModalWrapper>
            <Typography component="h2" variant="h6" gutterBottom>
              Restablecer contraseña
            </Typography>
            <form onSubmit={handlePasswordReset}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Correo electrónico"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Enviar
              </Button>
            </form>
          </ModalWrapper>
        </Modal>
        <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MainWrapper>
  );
}
