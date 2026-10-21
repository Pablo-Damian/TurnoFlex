const mongoose = require('mongoose');

const profesionalSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del profesional es obligatorio'],
            trim: true
        },
        especialidad: {
            type: String,
            required: [true, 'La especialidad es obligatoria'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Profesional', profesionalSchema);