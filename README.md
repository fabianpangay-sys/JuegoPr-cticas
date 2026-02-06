# Juego Prácticas - Conexión PostgreSQL

## Configuración de Base de Datos PostgreSQL

### 1. Configurar credenciales

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=juego_practicas
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3000
```

### 2. Crear la base de datos

Ejecuta en pgAdmin o en la terminal de PostgreSQL:

```sql
CREATE DATABASE juego_practicas;
```

Luego ejecuta el script `database.sql` para crear las tablas.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor

```bash
npm start
```

El servidor iniciará en `http://localhost:3000`

### 5. Verificar conexión

Abre `http://localhost:3000/api/test-connection` en tu navegador para verificar la conexión a PostgreSQL.

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/test-connection` | Probar conexión a BD |
| POST | `/api/init-database` | Crear tablas |
| POST | `/api/guardar-puntuacion` | Guardar puntuación |
| GET | `/api/mejores-puntuaciones` | Obtener ranking |
| GET | `/api/estadisticas-jugador/:nombre` | Estadísticas del jugador |

## Ejemplo de uso

```javascript
// Guardar puntuación desde el navegador
fetch('/api/guardar-puntuacion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Juan',
    puntuacion: 850,
    nivel: 5,
    tiempo: 180
  })
});

// Obtener mejores puntuaciones
fetch('/api/mejores-puntuaciones?limite=10')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Estructura de archivos

```
JuegoPracticas/
├── .env                    # Configuración de BD
├── package.json            # Dependencias
├── server.js               # Servidor Express
├── database.js             # Conexión PostgreSQL
├── database.sql            # Script SQL
├── index.htm               # Página principal
├── game.js                 # Lógica del juego
├── estilos.css             # Estilos
└── imagenes/               # Imágenes
```
