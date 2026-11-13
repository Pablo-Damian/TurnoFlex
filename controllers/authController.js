const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const normalizarEmail = (email) => email.trim().toLowerCase();

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body ?? {};

        if (
            typeof nombre !== 'string' ||
            !nombre.trim() ||
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password.trim()
        ) {
            return res.status(400).json({
                mensaje: 'Nombre, email y contrasenia son obligatorios'
            });
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                mensaje: 'La contrasenia supera el limite permitido de 72 bytes'
            });
        }

        const emailNormalizado = normalizarEmail(email);

        const usuarioExistente = await Usuario.findOne({
            email: emailNormalizado
        }).select('_id');

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El correo electronico ya se encuentra registrado'
            });
        }

        const nuevoUsuario = await Usuario.create({
            nombre: nombre.trim(),
            email: emailNormalizado,
            password,
            rol: 'cliente'
        });

        return res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                createdAt: nuevoUsuario.createdAt
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: 'El correo electronico ya se encuentra en uso'
            });
        }

        console.error('Error en registro:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al registrar usuario'
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                mensaje: 'Debe ingresar un email y una contrasenia validos'
            });
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                mensaje: 'La contrasenia supera el limite permitido'
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (
            typeof jwtSecret !== 'string' ||
            Buffer.byteLength(jwtSecret, 'utf8') < 32
        ) {
            console.error('JWT_SECRET no configurado adecuadamente');
            return res.status(500).json({
                mensaje: 'Configuracion de autenticacion no disponible'
            });
        }

        const emailNormalizado = normalizarEmail(email);

        const usuario = await Usuario.findOne({
            email: emailNormalizado
        }).select('+password');

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales invalidas'
            });
        }

        const passwordCorrecto = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecto) {
            return res.status(401).json({
                mensaje: 'Credenciales invalidas'
            });
        }

        const tokenPayload = {
            id: usuario._id.toString(),
            email: usuario.email,
            rol: usuario.rol
        };

        const token = jwt.sign(tokenPayload, jwtSecret, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });

        return res.status(200).json({
            mensaje: 'Autenticacion exitosa',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al procesar el inicio de sesion'
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};