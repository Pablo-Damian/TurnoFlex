const fs = require('fs');
const path = require('path');
const Profesional = require('../models/Profesional');

const rutaArchivo = path.join(__dirname, '../data/profesionales.json');

// --- Funciones auxiliares para leer y guardar ---
const leerProfesionales = () => {
    const data = fs.readFileSync(rutaArchivo, 'utf-8');
    return JSON.parse(data);
};

const guardarProfesionales = (profesionales) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(profesionales, null, 2));
};

// --- Operaciones CRUD ---

// GET: Obtener todos
const obtenerProfesionales = (req, res) => {
    const profesionales = leerProfesionales();
    res.status(200).json(profesionales);
};

// GET: Obtener por ID
const obtenerProfesionalPorId = (req, res) => {
    const profesionales = leerProfesionales();
    const id = parseInt(req.params.id);
    const profesional = profesionales.find(p => p.id === id);

    if (!profesional) {
        return res.status(404).json({ mensaje: "Profesional no encontrado" });
    }
    res.status(200).json(profesional);
};

// POST: Crear nuevo profesional
const crearProfesional = (req, res) => {
    const profesionales = leerProfesionales();
    const { nombre, especialidad } = req.body;

    // Validación básica
    if (!nombre || !especialidad) {
        return res.status(400).json({ mensaje: "Nombre y especialidad son obligatorios" });
    }

    const nuevoId = profesionales.length > 0 ? Math.max(...profesionales.map(p => p.id)) + 1 : 1;
    const nuevoProfesional = new Profesional(nuevoId, nombre, especialidad);

    profesionales.push(nuevoProfesional);
    guardarProfesionales(profesionales);

    res.status(201).json({ mensaje: "Profesional creado", profesional: nuevoProfesional });
};

// PUT/PATCH: Actualizar profesional
const actualizarProfesional = (req, res) => {
    const profesionales = leerProfesionales();
    const id = parseInt(req.params.id);
    const index = profesionales.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Profesional no encontrado" });
    }

    const { nombre, especialidad } = req.body;
    profesionales[index].nombre = nombre ?? profesionales[index].nombre;
    profesionales[index].especialidad = especialidad ?? profesionales[index].especialidad;

    guardarProfesionales(profesionales);
    res.status(200).json({ mensaje: "Profesional actualizado", profesional: profesionales[index] });
};

// DELETE: Eliminar profesional
const eliminarProfesional = (req, res) => {
    const profesionales = leerProfesionales();
    const id = parseInt(req.params.id);
    const profesionalesRestantes = profesionales.filter(p => p.id !== id);

    if (profesionales.length === profesionalesRestantes.length) {
        return res.status(404).json({ mensaje: "Profesional no encontrado" });
    }

    guardarProfesionales(profesionalesRestantes);
    res.status(200).json({ mensaje: "Profesional eliminado correctamente" });
};

module.exports = {
    obtenerProfesionales,
    obtenerProfesionalPorId,
    crearProfesional,
    actualizarProfesional,
    eliminarProfesional
};