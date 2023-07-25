import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const IdentificacionForm = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [rows, setRows] = useState([]);
  const [validInput, setValidInput] = useState(false);

  const columns = [
    { field: 'datos', headerName: 'Datos', width: 300 },
    { field: 'descripcion', headerName: 'Descripción', width: 300 },
  ];

  const fieldsOrder = [
    'cedula', 'nombre', 'profesion', 'fechaExpedicion', 'fechaExpiracion',
    'condicionCiudadano', 'fechaNacimiento', 'lugarNacimiento', 'conyuge',
    'estadoCivil', 'fechaInscripcionDefuncion', 'actaDefuncion', 'fechaDefuncion'
  ];

  const fieldsMap = {
    'cedula': 'Cédula',
    'nombre': 'Nombres Completos',
    'profesion': 'Profesión',
    'fechaExpedicion': 'Fecha Expedición de Cédula',
    'fechaExpiracion': 'Fecha Expiración de Cédula',
    'condicionCiudadano': 'Condición Ciudadano',
    'fechaNacimiento': 'Fecha Nacimiento',
    'lugarNacimiento': 'Lugar Nacimiento',
    'conyuge': 'Cónyugue',
    'estadoCivil': 'Estado Civil',
    'fechaInscripcionDefuncion': 'Fecha Inscripción Defunción',
    'actaDefuncion': 'Acta de Defunción',
    'fechaDefuncion': 'Fecha Defunción',
  };

  const isValidCedula = (cedula) => {
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let total = 0;

    if (cedula.length !== 10) {
      return false;
    }

    for (let i = 0; i < coeficientes.length; i++) {
      let valor = coeficientes[i] * parseInt(cedula[i]);
      if (valor >= 10) {
        valor = valor - 9;
      }
      total += valor;
    }

    total = total % 10 === 0 ? 0 : 10 - (total % 10);

    return total === parseInt(cedula[9]);
  };

  const handleChange = (e) => {
    setIdentificacion(e.target.value);
    setValidInput(isValidCedula(e.target.value));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && validInput) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      if (validInput) {
        const response = await axios.get('http://192.168.10.89:3001/consultar', {
          params: { identificacion },
        });

        if (Object.keys(response.data).length === 0) {
          setRows([]);
        } else {
          const data = response.data.paquete.entidades.entidad[0].filas.fila[0].columnas.columna;
          const dataMap = data.reduce((acc, item) => ({
            ...acc,
            [item.campo]: item.valor,
          }), {});

          const formattedData = fieldsOrder.map((field, i) => ({
            id: i,
            datos: fieldsMap[field],
            descripcion: dataMap[field],
          }));

          setRows(formattedData);
        }
      } else {
        console.error('La identificación no es válida');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ height: 900, marginTop: '2em' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Identificación"
            variant="outlined"
            value={identificacion}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSearch} disabled={!validInput}>
            Buscar
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 600, width: '100%', marginTop: '2em' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={6}
          components={{
            Toolbar: GridToolbar,
          }}
          density="compact"
        />
      </div>
    </Container>
  );
};

export default IdentificacionForm;
