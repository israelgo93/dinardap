import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';  
import { Button, TextField, Container, Typography, Box } from '@mui/material';
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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            setErrorMessage('Por favor, introduce un correo electrónico válido');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario conectado: ", userCredential.user);
            navigate('/');  
        } catch (error) {
            console.error("Error al iniciar sesión: ", error.message);
            setErrorMessage('Correo electrónico o contraseña incorrectos');
        }
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
                        </Box>
                    </form>
                </FormWrapper>
            </Container>
        </MainWrapper>
    );
}

