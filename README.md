# 📟 TurnoFlex - Sistema de Gestión de Turnos

> **Empresa:** Modo-DOS  
> **Materia:** Desarrollo de Sistemas Web (Back-End) - 2C 2026  
> **Institución:** IFTS 29  
> **Comisión:** A | **Grupo:** 33  

---

## 📌 Descripción del Proyecto
TurnoFlex es una solución backend construida sobre **Node.js** y **Express**, diseñada bajo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)**. En esta segunda instancia evaluativa, se migró la persistencia desde archivos planos JSON hacia una base de datos NoSQL orientada a documentos utilizando **MongoDB** y el ODM **Mongoose**, implementando acceso a datos asíncrono con **`async / await`**.

---

## 🛠️ Stack Tecnológico
* **Entorno de Ejecución:** Node.js (v24.x LTS)
* **Framework Web:** Express.js (v5.x)
* **Base de Datos NoSQL:** MongoDB (instancia local o clúster en la nube vía MongoDB Atlas)
* **ODM:** Mongoose (modelado de esquemas, tipos estrictos, referencias y validaciones nativas)
* **Variables de Entorno:** dotenv (aislamiento de credenciales y URIs de conexión)
* **Motor de Vistas:** Pug (renderizado con temática retro Modo-DOS)
* **Herramienta de Testing:** Thunder Client / Postman
* **Sistema de Módulos:** CommonJS (`require` / `module.exports`)

---

## 🏛️ Estructura del Proyecto (MVC)
```text
TurnoFlex/
├── config/
│   └── db.js              # Conexión asíncrona a MongoDB con Mongoose
├── controllers/
│   ├── profesionalesController.js  # CRUD asíncrono con Mongoose
│   └── turnosController.js         # Lógica anti-superposición y .populate()
├── models/
│   ├── Profesional.js     # Schema de Mongoose para profesionales
│   └── Turno.js           # Schema de Mongoose con ObjectId referenciado y enum
├── routes/
│   ├── profesionalesRoutes.js      # Enrutamiento REST modular
│   └── turnosRoutes.js
├── views/
│   ├── index.pug          # Vista principal estilo terminal retro
│   ├── layout.pug         # Plantilla base
│   └── nuevo-profesional.pug # Formulario de alta web
├── public/
│   └── css/
│       └── style.css      # Estilos monocromáticos MS-DOS con centrado Flexbox
├── .env                   # Variables de entorno (excluido en .gitignore)
├── .env.example           # Plantilla pública sin credenciales
├── .gitignore             # Exclusión de node_modules/ y .env
├── index.js               # Servidor Express, middlewares y arranque
└── package.json           # Dependencias oficiales del proyecto
```

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Pablo-Damian/TurnoFlex.git
   cd TurnoFlex
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   Crear un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

   ```ini
   PORT=3000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/turnoflex?retryWrites=true&w=majority
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

   El servidor iniciará en: `http://localhost:3000`

---

## 📡 Endpoints de la API REST

### Profesionales (`/api/profesionales`)
| Método | Endpoint | Descripción | Estado HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/profesionales` | Obtiene el listado completo de profesionales | `200 OK` |
| **GET** | `/api/profesionales/:id` | Obtiene un profesional específico por ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/profesionales` | Da de alta un nuevo profesional | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/profesionales/:id` | Modifica datos de un profesional | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/profesionales/:id` | Elimina un profesional del sistema | `200 OK` / `404 Not Found` |
| **GET** | `/nuevo-profesional` | Vista web con formulario interactivo de alta (Pug) | `200 OK` |

### Turnos (`/api/turnos`)
| Método | Endpoint | Descripción | Estado HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/turnos` | Lista turnos (admite filtro por estado: `?estado=reservado`) | `200 OK` |
| **GET** | `/api/turnos/:id` | Obtiene el detalle de un turno por ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/turnos` | Reserva un turno (Valida disponibilidad) | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/turnos/:id` | Actualiza estado (reservado, cancelado, atendido) | `200 OK` / `400 / 404` |
| **DELETE** | `/api/turnos/:id` | Elimina un turno del registro | `200 OK` / `404 Not Found` |

---

## ⚖️ Reglas de Negocio Implementadas
* **Control de superposición:** No se permite asignar dos turnos a un mismo profesional en la misma fecha y horario si el turno está activo.
* **Estados estrictos:** Los turnos únicamente aceptan los estados `'reservado'`, `'cancelado'` o `'atendido'`.
* **Cancelaciones seguras:** Cancelar un turno libera automáticamente la franja horaria para nuevas reservas.

---

## 🤖 Metodología y Registro de Uso de Inteligencia Artificial

Siguiendo las pautas pedagógicas de la cátedra, se documenta el empleo de asistentes conversacionales como herramientas de apoyo técnico, análisis de requerimientos y optimización sintáctica:

| Etapa | Consulta / Tarea Realizada | Verificación y Adaptación Manual |
| :--- | :--- | :--- |
| **Planificación** | Diseño de la estrategia de migración desde archivos JSON hacia esquemas NoSQL con Mongoose. | Se definió el alcance modular exacto respetando la consigna y evitando overengineering. |
| **Modelado** | Estructuración de esquemas de Mongoose con tipos estrictos, timestamps y relación referenciada por `ObjectId`. | Validación manual de expresiones regulares para formatos de fecha (`YYYY-MM-DD`), hora (`HH:MM`) y restricción `enum` para estados. |
| **Lógica Asíncrona** | Formulación de la consulta de no superposición con operador `$ne` y captura de excepciones `CastError`. | Adaptación de las funciones controladoras con sintaxis nativa `async/await` y bloques `try/catch`. |
| **Documentación** | Asistencia en la redacción técnica y confección de la matriz de casos de prueba. | Revisión integral de congruencia entre la especificación escrita y el código fuente. |