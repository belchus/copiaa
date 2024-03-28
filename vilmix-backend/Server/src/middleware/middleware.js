// Middleware de autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secreto', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// Ruta protegida
router.get('/protectedEndpoint', authenticateToken, (req, res) => {
    // Si llega a este punto, la autenticación fue exitosa
    // El usuario está disponible en req.user
    res.json({ message: 'Ruta protegida', user: req.user });
});
