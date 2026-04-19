import express from 'express';
import cors from 'cors';
import autoresRouter from './routes/autores';
import librosRouter from './routes/libros';
import prestamosRouter from './routes/prestamos';
import usuariosRouter from './routes/usuarios';

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// ==========================================
// RUTAS
// ==========================================
app.use('/autores', autoresRouter);
app.use('/libros', librosRouter);
app.use('/prestamos', prestamosRouter);
app.use('/usuarios', usuariosRouter);


// Health check
app.get('/', (_req, res) => {
  res.json({
    message: 'Biblioteca API - Sistema de gestión de inventarios',
    version: '1.0.0',
    endpoints: ['/autores', '/libros', '/prestamos', '/usuarios'],
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 Biblioteca API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   GET/POST   /autores`);
  console.log(`   GET/PUT/DELETE /autores/:id`);
  console.log(`   GET        /autores/:id/libros`);
  console.log(`   GET/POST   /libros`);
  console.log(`   GET/PUT/DELETE /libros/:id`);
  console.log(`   GET/POST   /libros/:id/autores`);
  console.log(`   DELETE     /libros/:id/autores/:id_autor`);
  console.log(`   GET/POST   /prestamos`);
  console.log(`   GET/PUT/DELETE /prestamos/:id`);
  console.log(`   GET/POST   /usuarios`);
  console.log(`   GET/PUT/DELETE /usuarios/:id\n`);
});

export default app;
