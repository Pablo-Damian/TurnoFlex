const Turno = require('../models/Turno');
const Profesional = require('../models/Profesional');

// GET: Obtener todos los turnos con soporte para filtro por estado y relacion poblada
const obtenerTurnos = async (req, res) => {
    try {
        const filtro = {};

        // Validacion y saneamiento del parametro de consulta para evitar inyeccion de operadores
        if (req.query.estado && typeof req.query.estado === 'string') {
            filtro.estado = req.query.estado.toLowerCase();
        }

        const turnos = await Turno.find(filtro).populate('profesional');
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener turnos:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al consultar turnos' });
    }
};

// GET: Obtener un turno por ID con los datos del profesional resueltos
const obtenerTurnoPorId = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id).populate('profesional');

        if (!turno) {
            return res.status(404).json({ mensaje: 'Turno no encontrado' });
        }

        res.status(200).json(turno);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        console.error('Error al obtener turno por ID:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// POST: Registrar un nuevo turno aplicando reglas de negocio
const crearTurno = async (req, res) => {
    try {
        const { profesional, clienteNombre, fecha, hora } = req.body;

        if (!profesional || !clienteNombre || !fecha || !hora) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios (profesional, clienteNombre, fecha, hora)'
            });
        }

        // 1. Verificar existencia del profesional asignado en la base de datos
        const profesionalExiste = await Profesional.findById(profesional);
        if (!profesionalExiste) {
            return res.status(404).json({ mensaje: 'El profesional especificado no existe' });
        }

        // 2. Regla anti-superposicion: comprobar que no exista cita activa en misma fecha y hora
        const ocupado = await Turno.findOne({
            profesional,
            fecha,
            hora,
            estado: { $ne: 'cancelado' }
        });

        if (ocupado) {
            return res.status(400).json({
                mensaje: 'El profesional ya tiene un turno en esa fecha y hora'
            });
        }

        // 3. Persistir nuevo documento
        const nuevoTurno = await Turno.create({
            profesional,
            clienteNombre,
            fecha,
            hora
        });

        // Retornar documento poblado con la informacion del profesional
        const turnoPoblado = await Turno.findById(nuevoTurno._id).populate('profesional');

        res.status(201).json(turnoPoblado);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'Identificador de profesional con formato invalido' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: error.message });
        }
        console.error('Error al crear turno:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al procesar la reserva' });
    }
};

// PUT: Modificar estado de una reserva (reservado, cancelado, atendido)
const actualizarTurno = async (req, res) => {
    try {
        const turnoActualizado = await Turno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('profesional');

        if (!turnoActualizado) {
            return res.status(404).json({ mensaje: 'Turno no encontrado' });
        }

        res.status(200).json({ mensaje: 'Turno actualizado exitosamente', turno: turnoActualizado });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: error.message });
        }
        console.error('Error al actualizar turno:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar el turno' });
    }
};

// DELETE: Eliminar un turno del registro
const eliminarTurno = async (req, res) => {
    try {
        const turnoEliminado = await Turno.findByIdAndDelete(req.params.id);

        if (!turnoEliminado) {
            return res.status(404).json({ mensaje: 'Turno no encontrado' });
        }

        res.status(200).json({ mensaje: 'Turno eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID con formato invalido' });
        }
        console.error('Error al eliminar turno:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar el turno' });
    }
};

module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno
};