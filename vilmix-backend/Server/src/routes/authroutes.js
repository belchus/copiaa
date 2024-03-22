import express from 'express';
import db from '../db/db.js'; // Importa tu conexión de base de datos desde otro archivo

const router = express.Router();

router.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login WHERE email = ? AND password = ?';
    const values = [req.body.email, req.body.password];
    db.query(sql, values, (error, data) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (data.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        return res.json(data);
    });
});

router.post('/register', (req, res) => {
    const sql = 'INSERT INTO login (email, password) VALUES (?, ?)';
    const values = [req.body.email, req.body.password];
    db.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
});

export default router;