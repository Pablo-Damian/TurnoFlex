
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema de usuarios de TurnoFlex.
const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },

        email: {
            type: String,
            required: [true, 'El correo electrónico es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Formato de correo electrónico inválido'
            ]
        },

        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
            select: false,

            // bcrypt utiliza como máximo los primeros 72 bytes.
            validate: {
                validator: function (value) {
                    return Buffer.byteLength(value, 'utf8') <= 72;
                },
                message: 'La contraseña no puede superar los 72 bytes UTF-8'
            }
        },

        rol: {
            type: String,
            enum: {
                values: ['admin', 'recepcion', 'cliente'],
                message: 'Rol no válido. Permitidos: admin, recepcion, cliente'
            },
            default: 'cliente'
        }
    },
    {
        timestamps: true,

        // Evita incluir password y __v al convertir documentos.
        toJSON: {
            transform: function (_doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        },

        toObject: {
            transform: function (_doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Genera el hash antes de guardar el usuario.
// Solo se ejecuta cuando la contraseña se crea o modifica.
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Exporta el modelo.
module.exports = mongoose.model('Usuario', usuarioSchema);