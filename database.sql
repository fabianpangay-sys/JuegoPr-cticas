-- Script para crear las tablas de la base de datos PostgreSQL
-- Ejecuta este script en pgAdmin o en la línea de comandos de PostgreSQL

-- Crear base de datos primero
-- CREATE DATABASE juego_practicas;

-- Conectar a la base de datos primero
-- \c juego_practicas

-- Crear tabla de puntuaciones
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

-- Crear tabla de jugadores
CREATE TABLE IF NOT EXISTS jugadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    total_puntuacion INTEGER DEFAULT 0,
    partidas_jugadas INTEGER DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de configuraciones
CREATE TABLE IF NOT EXISTS configuraciones (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(50) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_puntuaciones_nombre ON puntuaciones(nombre_jugador);
CREATE INDEX IF NOT EXISTS idx_puntuaciones_fecha ON puntuaciones(fecha_registro DESC);

-- Verificar que las tablas fueron creadas
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
