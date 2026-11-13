const express = require('express');
const router = express.Router();

const {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno
} = require('../controllers/turnosController');

const { verificarToken, permitirRoles } = require('../middlewares/auth');

// Rutas de lectura (abiertas a consulta de agenda)
router.get('/', obtenerTurnos);
router.get('/:id', obtenerTurnoPorId);

// Rutas protegidas que requieren token JWT valido
router.post('/', verificarToken, crearTurno);
router.put('/:id', verificarToken, actualizarTurno);

// Ruta con autorizacion estricta por rol (solo administradores pueden eliminar registros)
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarTurno);

module.exports = router;