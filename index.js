require('dotenv').config();
const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la conexión a la base de datos
conectarDB();

// Importar los enrutadores
const profesionalesRoutes = require('./routes/profesionalesRoutes');
const turnosRoutes = require('./routes/turnosRoutes');

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (PUG) ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- RUTAS DE LAS VISTAS (FRONTEND BÁSICO) ---
app.get('/', (req, res) => {
    res.render('index', { titulo: 'TurnoFlex - Inicio' });
});

app.get('/nuevo-profesional', (req, res) => {
    res.render('nuevo-profesional', { titulo: 'TurnoFlex - Nuevo Profesional' });
});

// --- RUTAS DE LA API REST ---
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/turnos', turnosRoutes);

// --- MANEJO DE ERRORES (404) ---
app.use((req, res) => {
    res.status(404).json({ error: '404 - Ruta no encontrada en TurnoFlex' });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor TurnoFlex corriendo en http://localhost:${PORT}`);
});