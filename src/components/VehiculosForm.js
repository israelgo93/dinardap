import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const VehiculosForm = () => {
    const [identificacion, setIdentificacion] = useState('');
    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const [rows, setRows] = useState([]);
    const [validInput, setValidInput] = useState(false);

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

    const isValidRUC = (ruc) => {
        return ruc.length === 13 && isValidCedula(ruc.slice(0, 10));
    };

    const isValidPasaporte = (pasaporte) => {
        return pasaporte.length >= 8 && pasaporte.length <= 10;
    };

    const handleIdentificacionChange = (e) => {
        const val = e.target.value;
        setIdentificacion(val);

        switch (tipoIdentificacion) {
            case 'CED':
                setValidInput(isValidCedula(val));
                break;
            case 'RUC':
                setValidInput(isValidRUC(val));
                break;
            case 'PAS':
                setValidInput(isValidPasaporte(val));
                break;
            default:
                setValidInput(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && validInput) {
            handleSearch();
        }
    };

    const columns = [
        { field: 'vehiculo', headerName: 'Vehículo', width: 200 },
        { field: 'chasis', headerName: 'Chasis', width: 200 },
        { field: 'motor', headerName: 'Motor', width: 200 },
        { field: 'placa', headerName: 'Placa', width: 200 },
    ];

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://192.168.10.89:3001/consultarAntVehiculos', {
                params: { tipoIdentificacion, identificacion },
            });

            if (response.data.length === 0) {
                setRows([]);
            } else {
                let formattedData = [];

                response.data.forEach((item, i) => {
                    const vehiculoKey = Object.keys(item)[0];
                    const vehiculoData = item[vehiculoKey];
                    formattedData.push({
                        id: i,
                        vehiculo: vehiculoKey,
                        chasis: vehiculoData.chasis,
                        motor: vehiculoData.motor,
                        placa: vehiculoData.placa,
                    });
                });

                setRows(formattedData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="lg" style={{ height: 900, marginTop: '2em' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="tipoIdentificacion-label">Tipo de Identificación</InputLabel>
                        <Select
                            labelId="tipoIdentificacion-label"
                            id="tipoIdentificacion"
                            value={tipoIdentificacion}
                            onChange={(e) => setTipoIdentificacion(e.target.value)}
                            label="Tipo de Identificación"
                        >
                            <MenuItem value={'CED'}>Cédula</MenuItem>
                            <MenuItem value={'RUC'}>RUC</MenuItem>
                            <MenuItem value={'PAS'}>Pasaporte</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        label="Identificación"
                        variant="outlined"
                        value={identificacion}
                        onChange={handleIdentificacionChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
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

export default VehiculosForm;