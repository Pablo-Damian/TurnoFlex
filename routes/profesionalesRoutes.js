const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
    obtenerProfesionales,
    obtenerProfesionalPorId,
    crearProfesional,
    actualizarProfesional,
    eliminarProfesional
} = require('../controllers/profesionalesController');

// Definimos las rutas CRUD y las conectamos con su controlador correspondiente
router.get('/', obtenerProfesionales);
router.get('/:id', obtenerProfesionalPorId);
router.post('/', crearProfesional);
router.put('/:id', actualizarProfesional);
router.delete('/:id', eliminarProfesional);

module.exports = router;