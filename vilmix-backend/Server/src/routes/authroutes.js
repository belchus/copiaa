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
    const sql = 'INSERT INTO login (email, password, role) VALUES (?, ?, ?)'; // Modificado para incluir el campo de rol
    const values = [req.body.email, req.body.password, 'usuario']; // Agregado el valor del rol por defecto
    db.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
});

const isAdmin = (req, res, next) => {
    // Aquí puedes agregar la lógica para verificar el rol del usuario
    // Por ejemplo, si el usuario tiene un campo 'role' en su objeto de sesión
    // y su valor es 'admin', entonces puedes permitir el acceso a la ruta
    if (req.user && req.user.role === 'admin') {
        // Si el usuario es un administrador, permite el acceso a la ruta
        next();
    } else {
        // Si el usuario no es un administrador, devuelve un error de acceso no autorizado
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