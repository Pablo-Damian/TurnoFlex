const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Importar los enrutadores
const profesionalesRoutes = require('./routes/profesionalesRoutes');
const turnosRoutes = require('./routes/turnosRoutes');

// --- MIDDLEWARES GLOBALES ---
// Para que Express entienda el formato JSON del req.body
app.use(express.json());
// Para que Express entienda los datos que vienen de un formulario HTML
app.use(express.urlencoded({ extended: true }));
// Para servir archivos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (PUG) ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- RUTAS DE LAS VISTAS (FRONTEND BÁSICO) ---
// Ruta raíz: Renderiza el inicio
app.get('/', (req, res) => {
    res.render('index', { titulo: 'TurnoFlex - Inicio' });
});

// Ruta para el formulario de Alta (NUEVA)
app.get('/nuevo-profesional', (req, res) => {
    res.render('nuevo-profesional', { titulo: 'TurnoFlex - Nuevo Profesional' });
});

// --- RUTAS DE LA API REST ---
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/turnos', turnosRoutes);

// --- MANEJO DE ERRORES (404) ---
// Si el cliente pide una ruta que no existe, cae aquí
app.use((req, res) => {
    res.status(404).json({ error: '404 - Ruta no encontrada en TurnoFlex' });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor TurnoFlex corriendo en http://localhost:${PORT}`);
});