const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());

// Cadena de conexión
let dbConfig = {
    server: '192.168.10.150',
    database: 'BP',
    user: 'desarrollo',
    password: 'DEV@123##',
    port: 1433,
    options: {
        encrypt: false,
        enableArithAbort: true,
        instanceName: 'EPAMSQL'
    }
};

app.get('/clientes', async (req, res) => {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.size || 50;
    const skip = (pageNumber - 1) * pageSize;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('skip', sql.Int, skip)
            .input('take', sql.Int, pageSize)
            .query('SELECT * FROM Clientes ORDER BY [Cuenta ACrm] OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY');

        res.json(result.recordsets[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

async function executeQuery(query, params = []) {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    params.forEach(param => {
        request.input(param.name, param.type, param.value);
    });

    const result = await request.query(query);
    return result;
}

app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Users (username, password, email) VALUES (@username, @password, @email)';
        const params = [
            { name: 'username', type: sql.NVarChar(50), value: username },
            { name: 'password', type: sql.NVarChar(255), value: hashedPassword },
            { name: 'email', type: sql.NVarChar(255), value: email }
        ];

        await executeQuery(query, params);

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = 'SELECT * FROM Users WHERE username = @username';
        const params = [{ name: 'username', type: sql.NVarChar(50), value: username }];
        const result = await executeQuery(query, params);

        if (result.recordset.length === 0) {
            return res.status(400).send('Invalid credentials');
        }

        const user = result.recordset[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(5000, '192.168.10.89', () => {
    console.log('Servidor escuchando en la IP 192.168.10.89 y puerto 5000');
});

