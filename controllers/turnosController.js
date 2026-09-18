const fs = require('fs');
const path = require('path');
const Turno = require('../models/Turno');

const rutaArchivo = path.join(__dirname, '../data/turnos.json');

const leerTurnos = () => {
    const data = fs.readFileSync(rutaArchivo, 'utf-8');
    return JSON.parse(data);
};

const guardarTurnos = (turnos) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(turnos, null, 2));
};

// GET: Obtener turnos (con filtro opcional por estado)
const obtenerTurnos = (req, res) => {
    let turnos = leerTurnos();

    // Implementación de Parámetros de consulta (Query Params)
    // Ej: /api/turnos?estado=reservado
    if (req.query.estado) {
        turnos = turnos.filter(t => t.estado.toLowerCase() === req.query.estado.toLowerCase());
    }

    res.status(200).json(turnos);
};

// GET: Obtener turno por ID
const obtenerTurnoPorId = (req, res) => {
    const turnos = leerTurnos();
    const id = parseInt(req.params.id);
    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        return res.status(404).json({ mensaje: "Turno no encontrado" });
    }
    res.status(200).json(turno);
};

// POST: Crear nuevo turno (CON VALIDACIONES DEL NEGOCIO)
const crearTurno = (req, res) => {
    const turnos = leerTurnos();
    const { profesionalId, clienteNombre, fecha, hora } = req.body;

    // 1. Validar campos obligatorios
    if (!profesionalId || !clienteNombre || !fecha || !hora) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios (profesionalId, clienteNombre, fecha, hora)" });
    }

    // 2. Regla de Negocio: Un profesional no puede tener dos turnos en el mismo horario
    const turnoOcupado = turnos.find(t => 
        t.profesionalId === profesionalId && 
        t.fecha === fecha && 
        t.hora === hora && 
        t.estado !== 'cancelado' // Si estaba cancelado, el horario sí está disponible
    );

    if (turnoOcupado) {
        return res.status(400).json({ mensaje: "El profesional ya tiene un turno reservado en esa fecha y horario." });
    }

    // 3. Crear el turno
    const nuevoId = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1;
    const nuevoTurno = new Turno(nuevoId, profesionalId, clienteNombre, fecha, hora);

    turnos.push(nuevoTurno);
    guardarTurnos(turnos);

    res.status(201).json({ mensaje: "Turno reservado con éxito", turno: nuevoTurno });
};

// PUT/PATCH: Modificar estado de un turno (Cancelar / Atender)
const actualizarTurno = (req, res) => {
    const turnos = leerTurnos();
    const id = parseInt(req.params.id);
    const index = turnos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    const { estado } = req.body;
    
    // Regla de Negocio: Validar estados permitidos
    const estadosValidos = ['reservado', 'cancelado', 'atendido'];
    if (estado && !estadosValidos.includes(estado)) {
        return res.status(400).json({ mensaje: "Estado no válido. Use: reservado, cancelado o atendido." });
    }

    turnos[index].estado = estado ?? turnos[index].estado;

    guardarTurnos(turnos);
    res.status(200).json({ mensaje: "Estado del turno actualizado", turno: turnos[index] });
};

// DELETE: Eliminar turno
const eliminarTurno = (req, res) => {
    const turnos = leerTurnos();
    const id = parseInt(req.params.id);
    const turnosRestantes = turnos.filter(t => t.id !== id);

    if (turnos.length === turnosRestantes.length) {
        return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    guardarTurnos(turnosRestantes);
    res.status(200).json({ mensaje: "Turno eliminado correctamente" });
};

module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno
};