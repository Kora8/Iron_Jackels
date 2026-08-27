# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Bitácora de desarrollo

### 25 de agosto de 2026

Se inició la integración del frontend de Iron Jackals con un backend y una base de datos MySQL.

#### Trabajo realizado

- Se creó la base de datos `iron_jackels` en MySQL.
- Se diseñaron las tablas necesarias para disciplinas, movimientos y rutinas.
- Se agregaron datos iniciales de las disciplinas de Iron Jackals.
- Se configuró el backend utilizando Node.js y Express.
- Se configuró la conexión con MySQL mediante `mysql2`.
- Se creó el archivo `database.js` para administrar la conexión a la base de datos.
- Se organizó el backend utilizando una arquitectura basada en:
  - `routes/`
  - `controllers/`
- Se comprobó correctamente la conexión entre Node.js y MySQL.
- Se realizó una prueba de consulta a la tabla `disciplinas`.
- Se verificó que el backend puede recuperar correctamente las 8 disciplinas almacenadas en MySQL.

#### Estructura actual

```text
Back/
├── controllers/
│   ├── movimientos.controller.js
│   ├── rutinas.controller.js
│   └── disciplinas.controller.js
│
├── routes/
│   ├── disciplinas.routes.js
│   ├── movimientos.routes.js
│   └── rutinas.routes.js
│
├── database.js
├── server.js
└── .env

Estado actual

El backend ya puede conectarse correctamente a MySQL.

El siguiente objetivo es terminar el endpoint:

GET /api/disciplinas

para posteriormente conectar Home.jsx con la API y reemplazar los datos locales del frontend por información obtenida directamente desde MySQL.

Arquitectura en desarrollo
React
   ↓
Express / API REST
   ↓
Routes
   ↓
Controllers
   ↓
database.js
   ↓
MySQL
Próximos pasos
 Finalizar y probar /api/disciplinas.
 Conectar Home.jsx con la API.
 Implementar la API de movimientos.
 Conectar CrearMovimiento.jsx con MySQL.
 Implementar la API de rutinas.
 Conectar CrearRutina.jsx con MySQL.
 Implementar consulta, edición y eliminación de movimientos.
 Implementar consulta, edición y eliminación de rutinas.

 ### 26 de agosto de 2026

Se logró conectar el frontend con el backend y la base de datos, reemplazando datos escritos a mano en React por información real proveniente de MySQL.

#### Trabajo realizado

- Se integró el flujo completo **Database → Backend/API → Frontend → Cards**.
- Se verificó que las imágenes de las disciplinas cargan correctamente desde las rutas configuradas.
- Se implementaron las cards dinámicas con datos de la base de datos:
  - 🥋 BJJ  
  - 🥊 Boxeo  
  - 🤼 Lucha  
  - 🦵 Muay Thai  
  - 🥊 Kick Boxing  
  - 🥋 Judo  
  - 💪 Ejercicio físico  
  - 🥊 MMA  
- Cada card incluye:
  - Categoría/tipo de disciplina  
  - Imagen de la disciplina  
  - Botones: **Crear movimiento**, **Crear rutina**, **Ver lista**, **Mis rutinas**

#### Estado actual

El frontend ya no depende de datos locales: las cards se alimentan directamente desde MySQL a través del backend.  
El problema de las rutas de imágenes quedó resuelto.

#### Próximos pasos

1. Probar el flujo completo de movimientos:  
   - Disciplina → Crear movimiento → Guardar en DB → Ver en lista  
2. Probar el flujo de rutinas:  
   - Disciplina → Crear rutina → Seleccionar movimientos → Ordenarlos → Guardar rutina → Mis rutinas  
3. Implementar la lógica de consulta, edición y eliminación para movimientos y rutinas.  
4. Consolidar la aplicación como un sistema funcional de entrenamiento, más allá de un catálogo visual.

---

Arquitectura en desarrollo:

```text
React (Frontend)
   ↓
Express / API REST (Backend)
   ↓
Routes
   ↓
Controllers
   ↓
database.js
   ↓
MySQL