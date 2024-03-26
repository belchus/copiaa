import express from 'express';
import db from '../db/db.js';

const router = express.Router();

// Ruta para guardar el carrito de un usuario
router.post('/guardar-carrito', (req, res) => {
    try {
        const { userId, items } = req.body; 
        const sql = 'INSERT INTO carritos (userId, items) VALUES (?, ?)';
        const values = [userId, JSON.stringify(items)]; 

        db.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al guardar el carrito:', error);
                res.status(500).json({ error: 'Error al guardar el carrito' });
                return;
            }

            console.log('Carrito guardado correctamente:', { userId, items });
            res.status(201).json({ message: 'Carrito guardado correctamente' });
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

export default router;
