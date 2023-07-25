import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Usar useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado: ", userCredential.user);
            navigate('/login');  // Navegar a la página de inicio de sesión después del registro exitoso
        } catch (error) {
            console.error("Error al registrar usuario: ", error.message);
        }
    };

    return (
        <div>
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Correo electrónico:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                </label>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}
