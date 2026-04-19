import { Router, Request, Response } from 'express';
import { db } from '../database';
import { AutorInput } from '../types';

const router = Router();

// GET /autores - Listar todos los autores
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(db.autores);
});

// POST /autores - Crear un nuevo autor
router.post('/', (req: Request, res: Response) => {
  const body: AutorInput = req.body;

  if (!body.nombre) {
    return res.status(400).json({ error: 'El campo nombre es requerido' });
  }

  const nuevoAutor = {
    id_autor: db.nextIds.autor++,
    nombre: body.nombre,
    nacionalidad: body.nacionalidad,
  };

  db.autores.push(nuevoAutor);
  return res.status(201).json(nuevoAutor);
});

// GET /autores/:id_autor - Obtener autor por ID
router.get('/:id_autor', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_autor as string);
  const autor = db.autores.find((a) => a.id_autor === id);

  if (!autor) {
    return res.status(404).json({ error: 'Autor no encontrado' });
  }

  return res.status(200).json(autor);
});

// PUT /autores/:id_autor - Actualizar autor por ID
router.put('/:id_autor', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_autor as string);
  const body: AutorInput = req.body;
  const index = db.autores.findIndex((a) => a.id_autor === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Autor no encontrado' });
  }

  if (!body.nombre) {
    return res.status(400).json({ error: 'El campo nombre es requerido' });
  }

  db.autores[index] = {
    ...db.autores[index],
    nombre: body.nombre,
    nacionalidad: body.nacionalidad,
  };

  return res.status(200).json(db.autores[index]);
});

// DELETE /autores/:id_autor - Eliminar autor por ID
router.delete('/:id_autor', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_autor as string);
  const index = db.autores.findIndex((a) => a.id_autor === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Autor no encontrado' });
  }

  db.autores.splice(index, 1);
  return res.status(204).send();
});

// GET /autores/:id_autor/libros - Listar libros de un autor
router.get('/:id_autor/libros', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_autor as string);
  const autor = db.autores.find((a) => a.id_autor === id);

  if (!autor) {
    return res.status(404).json({ error: 'Autor no encontrado' });
  }

  const asociaciones = db.librosAutores.filter((la) => la.id_autor === id);
  return res.status(200).json(asociaciones);
});

export default router;
