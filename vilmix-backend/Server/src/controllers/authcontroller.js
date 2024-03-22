import jwt from 'jsonwebtoken';

// Función para crear un token JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, 'hola1234', { expiresIn: '1h' }); // Cambia 'tu_clave_secreta' por una clave secreta segura
};

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization; // Obtener el token del encabezado Authorization

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'hola1234'); // Verificar y decodificar el token
    req.user = decoded; // Añadir la información del usuario decodificado al objeto de solicitud (req)
    next(); // Pasar al siguiente middleware
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export { generateToken, verifyToken };
