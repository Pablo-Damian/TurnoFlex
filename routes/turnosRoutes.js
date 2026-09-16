const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno
} = require('../controllers/turnosController');

// Definimos las rutas CRUD para los Turnos
router.get('/', obtenerTurnos);
router.get('/:id', obtenerTurnoPorId);
router.post('/', crearTurno);
router.put('/:id', actualizarTurno);
router.delete('/:id', eliminarTurno);

module.exports = router;