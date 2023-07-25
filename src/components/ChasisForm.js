import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ChasisForm = () => {
  const [chasis, setChasis] = useState('');
  const [rows, setRows] = useState([]);
  const [validInput, setValidInput] = useState(false);

  const columns = [
    { field: 'datos', headerName: 'Datos', width: 200 },
    { field: 'descripcion', headerName: 'Descripción', width: 300 },
  ];

  const fieldsOrder = ['chasis', 'estado', 'marca', 'modelo', 'placa'];

  const fieldsMap = {
    'chasis': 'Chasis',
    'estado': 'Estado',
    'marca': 'Marca',
    'modelo': 'Modelo',
    'placa': 'Placa',
  };

  const isValidChasis = (chasis) => {
    const re = /^[a-hj-npr-z0-9]{17}$/i;
    return re.test(chasis);
  };

  const handleChange = (e) => {
    setChasis(e.target.value);
    setValidInput(isValidChasis(e.target.value));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && validInput) {
      handleSearchByChasis();
    }
  };

  const handleSearchByChasis = async () => {
    try {
      if (validInput) {
        const response = await axios.get('http://192.168.10.89:3001/consultarPorChasis', {
          params: { chasis },
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
        console.error('El número de chasis ingresado no es válido');
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
            label="Chasis"
            variant="outlined"
            value={chasis}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSearchByChasis} disabled={!validInput}>
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

export default ChasisForm;
