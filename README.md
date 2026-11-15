# 📟 TurnoFlex - Sistema de Gestión de Turnos (Entrega Final)

> **Empresa:** Modo-DOS  
> **Materia:** Desarrollo de Sistemas Web (Back-End) - 2C 2026  
> **Institución:** IFTS 29  
> **Comisión:** A | **Grupo:** 33  
> **Desarrollador:** Pablo Damián Combis (Modalidad individual autorizada)

---

## 📌 Descripción del Proyecto
TurnoFlex es una API REST backend construida sobre **Node.js** y **Express**, diseñada bajo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)** y persistencia documental en **MongoDB Atlas** mediante **Mongoose**.

En esta Tercera Entrega (Final), el sistema consolida una capa integral de **seguridad, autenticación y autorización**, incorporando cifrado unidireccional de contraseñas con **bcrypt**, emisión y validación de tokens sin estado **JSON Web Token (JWT)** firmados con algoritmo **HS256**, control de acceso basado en roles (**RBAC**), inicialización secuencial de base de datos y auditoría de dependencias de producción.

---

## 📊 Matriz de Evolución Tecnológica (Entregas 1, 2 y 3)

| Dimensión Técnica | Primera Entrega (v1.0) | Segunda Entrega (v2.0) | Tercera Entrega / Final (v3.0) |
| :--- | :--- | :--- | :--- |
| **Persistencia de Datos** | Archivos planos JSON (`/data/`) manipulados con el módulo nativo `fs`. | Base de datos NoSQL documental en la nube (**MongoDB Atlas**) vía **Mongoose**. | **MongoDB Atlas** con colección adicional `usuarios`, índices únicos y validaciones extendidas. |
| **Modelado de Dominio** | Clases puras de JavaScript (ES6) con constructores manuales. | Esquemas tipados de Mongoose con `ObjectId`, `enum`, expresiones regulares y `timestamps`. | Esquema `Usuario` con validación de longitud UTF-8 (máx. 72 bytes), transformadores `toJSON` y hook `pre('save')`. |
| **Ejecución y Arranque** | Lectura/escritura sincrónica de disco y apertura directa del puerto HTTP. | Controladores asíncronos con `async/await` y `try/catch`; conexión en `config/db.js`. | Inicialización secuencial garantizada (`await conectarDB()` previo a `app.listen()`). |
| **Seguridad y Contraseñas** | Sin módulo de usuarios ni control de acceso. | Diseño conceptual de arquitectura de seguridad (base documental). | Hashing automático con `bcrypt` (12 salt rounds), aislamiento de secretos en `.env` (`>= 32` bytes). |
| **Autenticación y Autorización** | Rutas abiertas sin validación de identidad. | Rutas abiertas con foco en reglas de negocio y `.populate()`. | **JWT stateless (`HS256`, vigencia 1h)**, esquema `Authorization: Bearer` y middlewares **RBAC** por roles (`admin`, `recepcion`, `cliente`). |
| **Auditoría de Dependencias** | Instalación estándar de dependencias base. | Incorporación de `mongoose` y `dotenv`. | Saneamiento de producción con `npm audit --omit=dev` (0 vulnerabilidades) y aprobación explícita `allowScripts`. |

---

## 🛠️ Stack Tecnológico Final
* **Entorno de Ejecución:** Node.js (v24.x LTS)
* **Framework Web:** Express.js (v5.x)
* **Base de Datos NoSQL:** MongoDB Atlas (clúster en la nube)
* **ODM:** Mongoose (v9.x - esquemas, referencias `ObjectId`, `.populate()`, hooks y validaciones)
* **Seguridad y Autenticación:** `jsonwebtoken` (v9.x - algoritmo `HS256`) y `bcrypt` (v6.x - hashing unidireccional)
* **Variables de Entorno:** `dotenv` (gestión segura de `PORT`, `MONGODB_URI` y `JWT_SECRET`)
* **Motor de Vistas:** Pug (Server-Side Rendering con estética terminal retro Modo-DOS)
* **Sistema de Módulos:** CommonJS (`require` / `module.exports`)

---

## 🏛️ Estructura del Proyecto (MVC)
```text
TurnoFlex/
├── config/
│   └── db.js                      # Conexión asíncrona a MongoDB Atlas
├── controllers/
│   ├── authController.js          # Registro seguro (rol cliente) y login con emisión JWT
│   ├── profesionalesController.js # CRUD asíncrono de profesionales
│   └── turnosController.js        # Lógica anti-superposición, filtros y .populate()
├── middlewares/
│   └── auth.js                    # Verificación estricta JWT (HS256) y control RBAC (permitirRoles)
├── models/
│   ├── Profesional.js             # Schema de Mongoose para profesionales
│   ├── Turno.js                   # Schema de Mongoose con referencia ObjectId, enum e índice compuesto
│   └── Usuario.js                 # Schema con hash automático pre('save') y sanitización toJSON
├── routes/
│   ├── authRoutes.js              # Rutas públicas de registro e inicio de sesión
│   ├── profesionalesRoutes.js     # Rutas CRUD de profesionales
│   └── turnosRoutes.js            # Rutas de turnos protegidas con verificarToken y permitirRoles
├── views/
│   ├── index.pug                  # Vista principal estilo terminal retro
│   ├── layout.pug                 # Plantilla base
│   └── nuevo-profesional.pug      # Formulario de alta web
├── public/
│   └── css/
│       └── style.css              # Estilos monocromáticos MS-DOS con centrado Flexbox
├── .env                           # Variables de entorno privadas (excluido en .gitignore)
├── .env.example                   # Plantilla pública de variables requeridas
├── .gitignore                     # Exclusión de node_modules/ y .env
├── index.js                       # Arranque secuencial, middlewares y montaje de rutas
└── package.json                   # Dependencias, scripts y allowScripts de seguridad
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

   Crear un archivo `.env` en la raíz del proyecto tomando como base `.env.example`. Se requiere una clave `JWT_SECRET` de al menos 32 bytes (puede generarse localmente con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`):

   ```ini
   PORT=3000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/turnoflex?retryWrites=true&w=majority
   JWT_SECRET=<clave_secreta_minimo_32_caracteres>
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

   La consola confirmará la conexión secuencial con MongoDB Atlas previa a la apertura del puerto `3000`.

---

## 📡 Endpoints de la API REST

### Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción | Estado HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/registro` | Público | Registra un nuevo usuario asignando forzosamente el rol `cliente` y cifrando su clave. | `201 Created` / `400` / `409` |
| **POST** | `/api/auth/login` | Público | Valida credenciales con `bcrypt.compare` y emite un token JWT (`HS256`, vigencia `1h`). | `200 OK` / `400` / `401` |

### Profesionales (`/api/profesionales`)
| Método | Endpoint | Acceso | Operación Mongoose | Estado HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/profesionales` | Público | `Profesional.find()` | `200 OK` |
| **GET** | `/api/profesionales/:id` | Público | `Profesional.findById()` | `200 OK` / `400` / `404` |
| **POST** | `/api/profesionales` | Público | `Profesional.create()` | `201 Created` / `400` |
| **PUT** | `/api/profesionales/:id` | Público | `findByIdAndUpdate()` con validadores | `200 OK` / `400` / `404` |
| **DELETE** | `/api/profesionales/:id` | Público | `findByIdAndDelete()` | `200 OK` / `400` / `404` |
| **GET** | `/nuevo-profesional` | Público | Renderizado de formulario SSR (Pug) | `200 OK` |

### Turnos (`/api/turnos`)
| Método | Endpoint | Acceso / Roles | Operación Mongoose | Estado HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/turnos` | Público | `Turno.find().populate('profesional')` (filtro opcional `?estado=`) | `200 OK` / `400` |
| **GET** | `/api/turnos/:id` | Público | `Turno.findById().populate('profesional')` | `200 OK` / `400` / `404` |
| **POST** | `/api/turnos` | Autenticado (JWT) | Validación de profesional y no superposición; `Turno.create()` | `201 Created` / `400` / `401` / `404` |
| **PUT** | `/api/turnos/:id` | `admin`, `recepcion` | `findByIdAndUpdate()` con validación `enum` | `200 OK` / `400` / `401` / `403` / `404` |
| **DELETE** | `/api/turnos/:id` | `admin` | `findByIdAndDelete()` | `200 OK` / `400` / `401` / `403` / `404` |

---

## ⚖️ Decisiones de Arquitectura, Seguridad y Alcance

* **Autenticación Stateless (JWT + Bcrypt):** Se seleccionó JWT firmado con `HS256` en lugar de sesiones basadas en cookies (`express-session`) porque el núcleo del sistema opera como una API REST desacoplada. El registro asigna internamente el rol `cliente` para prevenir el escalamiento de privilegios y valida la longitud máxima de 72 bytes UTF-8 requerida por `bcrypt`.
* **Control de Acceso (RBAC) y Mitigación BOLA:** Las operaciones críticas de alteración y borrado de turnos (`PUT` y `DELETE`) están restringidas a roles operativos autorizados (`admin` y `recepcion`), impidiendo que usuarios con rol `cliente` modifiquen reservas ajenas mediante manipulación de identificadores.
* **Auditoría de Dependencias:** Tras ejecutar `npm audit fix` y autorizar explícitamente el componente nativo de `bcrypt` en `allowScripts`, el entorno de producción reporta **0 vulnerabilidades conocidas** (`npm audit --omit=dev`). Únicamente permanece un aviso moderado en `minimatch` ligado a la herramienta de desarrollo `nodemon`, el cual no afecta el entorno productivo ni justifica una degradación forzada de versiones.
* **Justificación de Tecnologías No Implementadas:**
  * *WebSockets (Socket.IO):* Se descartó su incorporación dado que un centro de gestión de turnos opera bajo transacciones HTTP puntuales (solicitud y respuesta). Mantener conexiones TCP bidireccionales persistentes generaría sobrediseño (*overengineering*) y consumo innecesario de recursos.
  * *Testing Automatizado (Jest / SuperTest):* Al no haberse desarrollado en los encuentros sincrónicos y priorizarse la verificación integral mediante matriz de casos de prueba y ejecución en Thunder Client, no se incorporaron suites de test unitarios.
  * *Despliegue Serverless / Rate Limiting:* La base de datos se encuentra operativa en la nube (MongoDB Atlas). El servidor de aplicaciones se mantiene en ejecución local controlada para preservar la compatibilidad de binarios nativos de `bcrypt` y evitar dependencias adicionales (`express-rate-limit`), documentándose como mejoras futuras para entornos productivos expuestos.

---

## 🤖 Metodología y Registro de Uso de Inteligencia Artificial

Conforme a las pautas de la cátedra, se documenta el empleo de herramientas de Inteligencia Artificial generativa como asistentes técnicos durante el ciclo de desarrollo, aplicando verificación y adaptación manual sobre cada componente:

| Etapa | Consulta / Tarea Realizada | Verificación y Adaptación Manual |
| :--- | :--- | :--- |
| **Planificación y Alcance** | Análisis de consignas finales y priorización de arquitectura de seguridad JWT sin *overengineering*. | Definición del alcance estricto acorde al caso TurnoFlex y redacción de justificación técnica de omisiones. |
| **Modelado de Seguridad** | Diseño del esquema `Usuario.js` con hook `pre('save')`, validación de 72 bytes para `bcrypt` y sanitización `toJSON`. | Ajuste de regex de email, configuración de 12 salt rounds y bloqueo de asignación de roles en el registro público. |
| **Middlewares y RBAC** | Implementación de `verificarToken` (`HS256`), control de longitud de `JWT_SECRET` y middleware `permitirRoles`. | Pruebas funcionales en Thunder Client verificando códigos `401 Unauthorized`, `403 Forbidden`, `200 OK` y `201 Created`. |
| **Auditoría y Arranque** | Diagnóstico de `npm audit`, aprobación granular con `allowScripts` y refactorización de arranque secuencial en `index.js`. | Ejecución manual de pruebas de arranque verificando la conexión a Atlas previa a `app.listen()`. |