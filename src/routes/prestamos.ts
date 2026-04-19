import { Router, Request, Response } from 'express';
import { db } from '../database';
import { PrestamoInput, PrestamoUpdate } from '../types';

const router = Router();

// GET /prestamos - Listar todos los préstamos
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(db.prestamos);
});

// POST /prestamos - Registrar un nuevo préstamo
router.post('/', (req: Request, res: Response) => {
  const body: PrestamoInput = req.body;

  if (!body.id_libro || !body.id_usuario || !body.fecha_prestamo || !body.fecha_devolucion_esperada) {
    return res.status(400).json({
      error: 'Campos requeridos: id_libro, id_usuario, fecha_prestamo, fecha_devolucion_esperada',
    });
  }

  const libro = db.libros.find((l) => l.id_libro === body.id_libro);
  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  const usuario = db.usuarios.find((u) => u.id_usuario === body.id_usuario);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (libro.stock_disponible <= 0) {
    return res.status(409).json({ error: 'No hay stock disponible del libro' });
  }

  // Descontar stock
  libro.stock_disponible -= 1;

  const nuevoPrestamo = {
    id_prestamo: db.nextIds.prestamo++,
    id_libro: body.id_libro,
    id_usuario: body.id_usuario,
    fecha_prestamo: body.fecha_prestamo,
    fecha_devolucion_esperada: body.fecha_devolucion_esperada,
    fecha_devolucion_real: null,
    estado: 'activo' as const,
  };

  db.prestamos.push(nuevoPrestamo);
  return res.status(201).json(nuevoPrestamo);
});

// GET /prestamos/:id_prestamo - Obtener préstamo por ID
router.get('/:id_prestamo', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_prestamo as string);
  const prestamo = db.prestamos.find((p) => p.id_prestamo === id);

  if (!prestamo) {
    return res.status(404).json({ error: 'Préstamo no encontrado' });
  }

  return res.status(200).json(prestamo);
});

// PUT /prestamos/:id_prestamo - Actualizar préstamo (registrar devolución)
router.put('/:id_prestamo', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_prestamo as string);
  const body: PrestamoUpdate = req.body;
  const index = db.prestamos.findIndex((p) => p.id_prestamo === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Préstamo no encontrado' });
  }

  const estadosValidos = ['activo', 'devuelto', 'vencido'];
  if (body.estado && !estadosValidos.includes(body.estado)) {
    return res.status(400).json({ error: 'Estado inválido. Valores permitidos: activo, devuelto, vencido' });
  }

  const prestamoAnterior = db.prestamos[index];

  // Si se marca como devuelto, reponer stock
  if (body.estado === 'devuelto' && prestamoAnterior.estado !== 'devuelto') {
    const libro = db.libros.find((l) => l.id_libro === prestamoAnterior.id_libro);
    if (libro) {
      libro.stock_disponible += 1;
    }
  }

  db.prestamos[index] = {
    ...prestamoAnterior,
    fecha_devolucion_real: body.fecha_devolucion_real ?? prestamoAnterior.fecha_devolucion_real,
    estado: body.estado ?? prestamoAnterior.estado,
  };

  return res.status(200).json(db.prestamos[index]);
});

// DELETE /prestamos/:id_prestamo - Eliminar préstamo por ID
router.delete('/:id_prestamo', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_prestamo as string);
  const index = db.prestamos.findIndex((p) => p.id_prestamo === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Préstamo no encontrado' });
  }

  db.prestamos.splice(index, 1);
  return res.status(204).send();
});

export default router;
