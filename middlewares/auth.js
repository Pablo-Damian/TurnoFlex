const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({
            mensaje: 'Acceso denegado: encabezado de autorizacion no provisto'
        });
    }

    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({
            mensaje: 'Acceso denegado: formato de token invalido (requiere Bearer <token>)'
        });
    }

    const token = partes[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error('JWT_SECRET no configurado');
        return res.status(500).json({
            mensaje: 'Error interno de configuracion de seguridad'
        });
    }

    try {
        const decodificado = jwt.verify(token, jwtSecret, {
            algorithms: ['HS256']
        });
        req.usuario = decodificado;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                mensaje: 'Token expirado: inicie sesion nuevamente'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                mensaje: 'Token invalido o firma no verificada'
            });
        }
        console.error('Error en verificacion de token:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno al validar autorizacion'
        });
    }
};

const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.rol) {
            return res.status(403).json({
                mensaje: 'Acceso restringido: rol de usuario no identificado'
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: 'Acceso denegado: permisos insuficientes para realizar esta operacion'
            });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles
};