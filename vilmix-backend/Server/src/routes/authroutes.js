import express from 'express';
import db from '../db/db.js'; // Importa tu conexión de base de datos desde otro archivo
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();



router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM login WHERE email = ?';
    const values = [email];
    db.query(sql, values, (error, data) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (data.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const user = data[0];
        // Verificar la contraseña
        if (password !== user.password) { // Comparar la contraseña sin hashear
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Si las credenciales son válidas, generar token JWT
        const token = jwt.sign({ email: user.email, role: user.role }, 'secreto', { expiresIn: '1h' });
        return res.json({ token });
    });
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

// Ruta protegida que solo puede ser accedida con un token válido
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Ruta protegida' });
});


router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Verificar si el correo electrónico ya existe en la base de datos
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM login WHERE email = ?';
    db.query(checkEmailQuery, [email], (error, results) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const emailExists = results[0].count > 0;
        if (emailExists) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Si el correo electrónico no existe, proceder con el registro del usuario
        const insertUserQuery = 'INSERT INTO login (email, password, role) VALUES (?, ?, ?)';
        const values = [email, password, 'usuario'];
        db.query(insertUserQuery, values, (error, result) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            return res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
    });
});



const isAdmin = (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
      
        next();
    } else {

        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

// Ruta protegida que solo puede ser accedida por administradores
router.get('/admin-only', isAdmin, (req, res) => {
    // Si se llega a esta parte del código, significa que el usuario es un administrador
    // y tiene acceso a esta ruta
    res.json({ message: 'Esta es una ruta solo para administradores' });
});


export default router;