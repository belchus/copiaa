// authMiddleware.js
const addTokenToHeaders = (req, res, next) => {
    // Obtener el token del usuario desde donde lo tengas almacenado
    const userToken = obtenerTokenDeDondeCorresponda(); // Esto dependerá de cómo almacenes y recuperes el token del usuario en tu aplicación
    
    // Agregar el token a los encabezados de la solicitud saliente
    if (userToken) {
      req.headers.authorization = `Bearer ${userToken}`;
    }
    
    next();
  };
  
export default addTokenToHeaders;