import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';  
import { Button, TextField, Container, Typography, Box, Grid } from '@mui/material';
import validator from 'validator';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
            console.log("Usuario registrado: ", userCredential.user);
            navigate('/login');  
        } catch (error) {
            console.error("Error al registrar usuario: ", error.message);
        }
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
                </FormWrapper>
            </Container>
        </MainWrapper>
    );
}
