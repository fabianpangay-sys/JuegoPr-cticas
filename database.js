const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'juego_practicas',
  password: process.env.DB_PASSWORD || 'FJPRMPVR2023',
  port: process.env.DB_PORT || 5432,
});

// Manejo de errores de conexión
pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a PostgreSQL:', err.message);
});

// Funciones utilitarias para la base de datos

// Verificar conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Fecha del servidor:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('Error de conexión:', error.message);
    return false;
  }
}

// Crear tablas necesarias
async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS puntuaciones (
      id SERIAL PRIMARY KEY,
      nombre_jugador VARCHAR(100) NOT NULL,
      puntuacion INTEGER NOT NULL,
      nivel INTEGER DEFAULT 1,
      tiempo_juego INTEGER DEFAULT 0,
      errores INTEGER DEFAULT 0,
      pistas_usadas INTEGER DEFAULT 0,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS jugadores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) UNIQUE NOT NULL,
      total_puntuacion INTEGER DEFAULT 0,
      partidas_jugadas INTEGER DEFAULT 0,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS configuraciones (
      id SERIAL PRIMARY KEY,
      clave VARCHAR(50) UNIQUE NOT NULL,
      valor TEXT,
      descripcion TEXT,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Tablas creadas/verificadas correctamente');
  } catch (error) {
    console.error('Error al crear tablas:', error.message);
  }
}

// Guardar puntuación
async function guardarPuntuacion(nombre, puntuacion, nivel = 1, tiempo = 0, errores = 0, pistasUsadas = 0) {
  const query = `
    INSERT INTO puntuaciones (nombre_jugador, puntuacion, nivel, tiempo_juego, errores, pistas_usadas)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  try {
    const result = await pool.query(query, [nombre, puntuacion, nivel, tiempo, errores, pistasUsadas]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al guardar puntuación:', error.message);
    throw error;
  }
}

// Obtener mejores puntuaciones
async function obtenerMejoresPuntuaciones(limite = 10) {
  const query = `
    SELECT * FROM puntuaciones
    ORDER BY fecha_registro DESC
    LIMIT $1
  `;
  
  try {
    const result = await pool.query(query, [limite]);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener puntuaciones:', error.message);
    throw error;
  }
}

// Registrar o actualizar jugador
async function registrarJugador(nombre) {
  const query = `
    INSERT INTO jugadores (nombre)
    VALUES ($1)
    ON CONFLICT (nombre) DO UPDATE SET
      partidas_jugadas = jugadores.partidas_jugadas + 1
    RETURNING *
  `;
  
  try {
    const result = await pool.query(query, [nombre]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al registrar jugador:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  guardarPuntuacion,
  obtenerMejoresPuntuaciones,
  registrarJugador
};
