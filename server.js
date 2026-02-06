const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Servir archivos estáticos
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.htm'));
});

// API Routes

// Probar conexión a base de datos
app.get('/api/test-connection', async (req, res) => {
  try {
    const connected = await db.testConnection();
    if (connected) {
      res.json({ success: true, message: 'Conexión a PostgreSQL exitosa' });
    } else {
      res.status(500).json({ success: false, message: 'Error de conexión a PostgreSQL' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Inicializar base de datos (crear tablas)
app.post('/api/init-database', async (req, res) => {
  try {
    await db.initializeDatabase();
    res.json({ success: true, message: 'Base de datos inicializada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Guardar puntuación
app.post('/api/guardar-puntuacion', async (req, res) => {
  try {
    const { nombre, puntuacion, nivel, tiempo, errores, pistasUsadas } = req.body;
    
    if (!nombre || puntuacion === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre y puntuación son requeridos' 
      });
    }
    
    // Registrar jugador
    await db.registrarJugador(nombre);
    
    // Guardar puntuación
    const resultado = await db.guardarPuntuacion(
      nombre, 
      puntuacion, 
      nivel || 1, 
      tiempo || 0,
      errores || 0,
      pistasUsadas || 0
    );
    
    res.json({ 
      success: true, 
      message: 'Puntuación guardada correctamente',
      data: resultado 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Obtener mejores puntuaciones
app.get('/api/mejores-puntuaciones', async (req, res) => {
  try {
    const limite = req.query.limite || 10;
    const puntuaciones = await db.obtenerMejoresPuntuaciones(limite);
    res.json({ success: true, data: puntuaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Obtener estadísticas generales
app.get('/api/estadisticas-generales', async (req, res) => {
  try {
    const scoresResult = await db.pool.query(
      `SELECT 
        COUNT(DISTINCT nombre_jugador) as "totalPlayers",
        COUNT(*) as "totalGames",
        AVG(puntuacion) as "avgScore",
        AVG(tiempo_juego) as "avgTime"
      FROM puntuaciones`
    );
    
    res.json({ success: true, data: scoresResult.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API de autenticación de administrador
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'FJPRMPVR2023';
    
    if (password === adminPassword) {
      res.json({ success: true, token: 'admin-token-' + Date.now() });
    } else {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
  // Probar conexión a base de datos al iniciar
  console.log('Conectando a PostgreSQL...');
  const connected = await db.testConnection();
  
  if (connected) {
    console.log('✓ PostgreSQL conectado');
    // Inicializar tablas
    await db.initializeDatabase();
    console.log('✓ Tablas verificadas/creadas');
  } else {
    console.log('✗ Error al conectar PostgreSQL. Verifica tus credenciales en .env');
  }
});
