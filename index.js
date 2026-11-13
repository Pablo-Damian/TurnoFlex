require('dotenv').config();
const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializacion de la conexion a MongoDB Atlas
conectarDB();

// Importacion de enrutadores modulares
const profesionalesRoutes = require('./routes/profesionalesRoutes');
const turnosRoutes = require('./routes/turnosRoutes');
const authRoutes = require('./routes/authRoutes');

// Middlewares globales de procesamiento
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuracion del motor de plantillas Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Rutas para vistas de servidor (SSR)
app.get('/', (req, res) => {
    res.render('index', { titulo: 'TurnoFlex - Inicio' });
});

app.get('/nuevo-profesional', (req, res) => {
    res.render('nuevo-profesional', { titulo: 'TurnoFlex - Nuevo Profesional' });
});

// Montaje de rutas de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/turnos', turnosRoutes);

// Manejo centralizado de recursos no encontrados (404)
app.use((req, res) => {
    res.status(404).json({ error: '404 - Ruta no encontrada en TurnoFlex' });
});

// Apertura del socket del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor TurnoFlex corriendo en http://localhost:${PORT}`);
});