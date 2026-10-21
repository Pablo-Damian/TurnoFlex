const Profesional = require('../models/Profesional');

// GET: Obtener todos los profesionales
const obtenerProfesionales = async (req, res) => {
    try {
        const profesionales = await Profesional.find();
        res.status(200).json(profesionales);
    } catch (error) {
        console.error('Error al obtener profesionales:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al consultar profesionales' });
    }
};

// GET: Obtener un profesional por ID
const obtenerProfesionalPorId = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id);

        if (!profesional) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.status(200).json(profesional);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        console.error('Error al obtener profesional por ID:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// POST: Crear nuevo profesional
const crearProfesional = async (req, res) => {
    try {
        const { nombre, especialidad } = req.body;

        if (!nombre || !especialidad) {
            return res.status(400).json({ mensaje: 'Nombre y especialidad son obligatorios' });
        }

        const nuevoProfesional = await Profesional.create({
            nombre,
            especialidad
        });

        res.status(201).json({ mensaje: 'Profesional creado exitosamente', profesional: nuevoProfesional });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: error.message });
        }
        console.error('Error al crear profesional:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al crear el profesional' });
    }
};

// PUT: Actualizar datos de un profesional
const actualizarProfesional = async (req, res) => {
    try {
        const profesionalActualizado = await Profesional.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!profesionalActualizado) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.status(200).json({ mensaje: 'Profesional actualizado', profesional: profesionalActualizado });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: error.message });
        }
        console.error('Error al actualizar profesional:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar' });
    }
};

// DELETE: Eliminar profesional
const eliminarProfesional = async (req, res) => {
    try {
        const profesionalEliminado = await Profesional.findByIdAndDelete(req.params.id);

        if (!profesionalEliminado) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        res.status(200).json({ mensaje: 'Profesional eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        console.error('Error al eliminar profesional:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar' });
    }
};

module.exports = {
    obtenerProfesionales,
    obtenerProfesionalPorId,
    crearProfesional,
    actualizarProfesional,
    eliminarProfesional
};