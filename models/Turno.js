const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema(
    {
        profesional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profesional',
            required: [true, 'El profesional asignado es obligatorio']
        },
        clienteNombre: {
            type: String,
            required: [true, 'El nombre del cliente es obligatorio'],
            trim: true
        },
        fecha: {
            type: String,
            required: [true, 'La fecha es obligatoria'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha invalido (YYYY-MM-DD)']
        },
        hora: {
            type: String,
            required: [true, 'La hora es obligatoria'],
            match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora invalido (HH:MM)']
        },
        estado: {
            type: String,
            enum: {
                values: ['reservado', 'cancelado', 'atendido'],
                message: 'Estado no valido. Permitidos: reservado, cancelado, atendido'
            },
            default: 'reservado'
        }
    },
    {
        timestamps: true
    }
);

// Indice compuesto para optimizar las consultas de disponibilidad y regla anti-superposicion
turnoSchema.index({ profesional: 1, fecha: 1, hora: 1 });

module.exports = mongoose.model('Turno', turnoSchema);