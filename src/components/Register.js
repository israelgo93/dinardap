import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, sendEmailVerification } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Grid, Snackbar } from '@mui/material';
import validator from 'validator';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MuiAlert from '@mui/material/Alert';

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

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de email
        if (!validator.isEmail(email)) {
            setErrorMessage('Por favor, introduce un correo electrónico válido');
            return;
        }

        // Validación de contraseña
        const passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        if (!passwordRegEx.test(password)) {
            setErrorMessage('La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula, un número y un caracter especial');
            return;
        }

        // Confirmación de contraseña
        if (password !== passwordConfirm) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil del usuario con el nombre y apellido
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Enviar correo de verificación
            await sendEmailVerification(userCredential.user)
                .then(() => {
                    setOpenSnackbar(true);
                    setTimeout(() => navigate('/login'), 10000); // Redirigir después de 10 segundos
                });

        } catch (error) {
            console.error("Error al registrar usuario: ", error.message);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <MainWrapper>
            <Container component="main" maxWidth="xs">
                <FormWrapper>
                    <Typography component="h1" variant="h5">
                        Registrate
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombres"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Apellidos"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            autoComplete="new-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Confirmar Contraseña"
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            autoComplete="new-password"
                        />
                        {errorMessage && (
                            <Typography color="error">
                                {errorMessage}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Registrarse
                        </Button>
                    </form>
                    <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/login')}
                            variant="outlined"
                            style={{ color: '#00008B', borderColor: '#00008B' }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Grid>
                    <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Estimado {firstName} {lastName}, <br />
                        Verifica la dirección de correo electrónico {email} <br />
                        registrado en el Portal Dinardap EPAM.
                        </MuiAlert>
                    </Snackbar>
                </FormWrapper>
            </Container>
        </MainWrapper>
    );
}
