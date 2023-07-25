import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container } from '@mui/material';
import axios from 'axios';
import { GridToolbar } from '@mui/x-data-grid';

const ClientesForm = () => {

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);

    const columns = [
        { field: 'Cuenta ACrm', headerName: 'Cuenta ACrm', width: 150 },
        { field: 'Cuenta EPAM', headerName: 'Cuenta EPAM', width: 150 },
        { field: 'Cedula', headerName: 'Cedula', width: 120 },
        { field: 'Nombre', headerName: 'Nombre', width: 300 },
        { field: 'Edad', headerName: 'Edad', width: 80 },
        { field: 'FechaNacimiento', headerName: 'Fecha Nacimiento', width: 150 },
        { field: 'Defuncion', headerName: 'Defuncion', width: 100 },
        { field: 'Total Deuda', headerName: 'Total Deuda', width: 100 },
        { field: 'Deuda Captital', headerName: 'Deuda Capital', width: 120 },
        { field: 'Deuda Intereses', headerName: 'Deuda Intereses', width: 120 },
        { field: 'Deuda 2018', headerName: 'Deuda 2018', width: 100 },
        { field: 'Deuda 2019', headerName: 'Deuda 2019', width: 100 },
        { field: 'Deuda 2020', headerName: 'Deuda 2020', width: 100 },
        { field: 'Deuda 2021', headerName: 'Deuda 2021', width: 100 },
        { field: 'Deuda 2022', headerName: 'Deuda 2022', width: 100 },
        { field: 'Clase Persona', headerName: 'Clase Persona', width: 120 },
        { field: 'Tipo Identificación', headerName: 'Tipo Identificación', width: 150 },       
        { field: 'Tarifa', headerName: 'Tarifa', width: 120 },
        { field: 'Estado Servicio', headerName: 'Estado Servicio', width: 150 },
        { field: 'Procesado', headerName: 'Procesado', width: 100 },
    ];


    const fetchData = async (page = 1, size = 50) => {
        try {
            const response = await axios.get(`http://192.168.10.89:5000/clientes?page=${page}&size=${size}`);
            const data = response.data.map((item, index) => ({ id: index + 1, ...item }));
            setRows(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
        fetchData(page + 1);
    }

    const handlePrevPage = () => {
        setPage(prevPage => prevPage - 1);
        fetchData(page - 1);
    }

    return (
        <Container>
            <Button onClick={handlePrevPage} disabled={page === 1}>Página anterior</Button>
            <Button onClick={handleNextPage}>Página siguiente</Button>

            <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          components={{
            Toolbar: GridToolbar, 
          }}
          density="compact"
        />

        </Container>
    );
}

export default ClientesForm;
