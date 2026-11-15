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

// Rutas de consulta general y por identificador
router.get('/', obtenerTurnos);
router.get('/:id', obtenerTurnoPorId);

// Ruta protegida para reserva de turnos por usuarios autenticados
router.post('/', verificarToken, crearTurno);

// Rutas con autorizacion basada en roles (RBAC)
router.put('/:id', verificarToken, permitirRoles('admin', 'recepcion'), actualizarTurno);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarTurno);

module.exports = router;