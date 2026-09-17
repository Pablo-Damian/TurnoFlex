# 📟 TurnoFlex - Sistema de Gestión de Turnos

> **Empresa:** Modo-DOS  
> **Materia:** Desarrollo de Sistemas Web (Back-End) - 2C 2026  
> **Institución:** IFTS 29  
> **Comisión:** A | **Grupo:** 33  

---

## 📌 Descripción del Proyecto
TurnoFlex es una solución backend construida sobre **Node.js** y **Express**, diseñada bajo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)**. Permite gestionar profesionales de la salud y la reserva de turnos, asegurando la integridad de la agenda mediante validaciones de negocio en el servidor y persistencia local en archivos JSON.

---

## 🛠️ Stack Tecnológico
* **Entorno de Ejecución:** Node.js (v24.x LTS)
* **Framework Web:** Express.js (v5.x)
* **Persistencia:** Archivos planos JSON manipulados con el módulo nativo `fs` (sin MongoDB en esta instancia)
* **Motor de Vistas:** Pug (renderizado con temática retro Modo-DOS)
* **Herramienta de Testing:** Thunder Client / Postman
* **Sistema de Módulos:** CommonJS (`require` / `module.exports`)

---

## 🏛️ Estructura del Proyecto (MVC)
```text
TurnoFlex/
├── controllers/       # Lógica de negocio y persistencia en archivos
│   ├── profesionalesController.js
│   └── turnosController.js
├── data/              # Base de datos simulada en JSON
│   ├── profesionales.json
│   └── turnos.json
├── models/            # Clases y estructuras de datos (POO)
│   ├── Profesional.js
│   └── Turno.js
├── public/            # Archivos estáticos
│   └── css/
│       └── style.css  # Estilos retro terminal MS-DOS
├── routes/            # Enrutadores modulares de Express
│   ├── profesionalesRoutes.js
│   └── turnosRoutes.js
├── views/             # Plantillas Pug para renderizado en servidor
│   ├── index.pug
│   └── layout.pug
├── index.js           # Punto de entrada y servidor principal
└── package.json       # Dependencias y scripts de ejecución
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

3. **Ejecutar en modo desarrollo:**
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

### Turnos (`/api/turnos`)
| Método | Endpoint | Descripción | Estado HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/turnos` | Obtiene todos los turnos registrados | `200 OK` |
| **GET** | `/api/turnos/:id` | Obtiene el detalle de un turno por ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/turnos` | Reserva un turno (Valida disponibilidad) | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/turnos/:id` | Actualiza estado (reservado, cancelado, atendido) | `200 OK` / `400 / 404` |
| **DELETE** | `/api/turnos/:id` | Elimina un turno del registro | `200 OK` / `404 Not Found` |

---

## ⚖️ Reglas de Negocio Implementadas
* **Control de superposición:** No se permite asignar dos turnos a un mismo profesional en la misma fecha y horario si el turno está activo.
* **Estados estrictos:** Los turnos únicamente aceptan los estados `'reservado'`, `'cancelado'` o `'atendido'`.
* **Cancelaciones seguras:** Cancelar un turno libera automáticamente la franja horaria para nuevas reservas.
```