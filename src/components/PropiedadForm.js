import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PropiedadForm = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [propiedades, setPropiedades] = useState([]);
  const [validInput, setValidInput] = useState(false);

  const fieldsOrder = [
    'nombres', 'apellidos', 'razonSocial', 'tipoContrato', 'contraparte', 'fechaInscripcion', 
    'claveCastratal', 'parroquia', 'canton', 'cuantia', 'numeroJuicio', 'ubicacionDato'
  ];

  const fieldsMap = {
    'nombres': 'Nombres',
    'apellidos': 'Apellidos',
    'razonSocial': 'Razón Social',
    'tipoContrato': 'Tipo de Contrato',
    'contraparte': 'Contraparte',
    'fechaInscripcion': 'Fecha de Inscripción',
    'claveCastratal': 'Clave Catastral',
    'parroquia': 'Parroquia',
    'canton': 'Cantón',
    'cuantia': 'Cuantía',
    'numeroJuicio': 'Número de Juicio',
    'ubicacionDato': 'Ubicación del Dato'
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
        const response = await axios.get('http://192.168.10.89:3001/consultarPorIdentificacion', {
          params: { identificacion },
        });

        if (Object.keys(response.data).length === 0) {
          setPropiedades([]);
        } else {
          const entidades = response.data.paquete.entidades.entidad[0].filas.fila;
          const formattedData = entidades.map((entidad) => {
            const data = entidad.columnas.columna;
            const dataMap = data.reduce((acc, item) => ({
              ...acc,
              [item.campo]: item.valor,
            }), {});
            return fieldsOrder.map((field) => ({
              datos: fieldsMap[field],
              descripcion: dataMap[field],
            }));
          });
          setPropiedades(formattedData);
        }
      } else {
        console.error('La identificación no es válida');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2em' }}>
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
      <div style={{ marginTop: '2em' }}>
        {propiedades.map((propiedad, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Propiedad {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {propiedad.map((field) => (
                  <div key={field.datos}>{field.datos}: {field.descripcion}</div>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Container>
  );
};

export default PropiedadForm;
