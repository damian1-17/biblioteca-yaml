import { Router, Request, Response } from 'express';
import { db } from '../database';
import { LibroInput, LibroAutorInput } from '../types';

const router = Router();

// GET /libros - Listar todos los libros
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(db.libros);
});

// POST /libros - Crear un nuevo libro
router.post('/', (req: Request, res: Response) => {
  const body: LibroInput = req.body;

  if (!body.isbn || !body.titulo || body.stock_total === undefined || body.stock_disponible === undefined) {
    return res.status(400).json({ error: 'Campos requeridos: isbn, titulo, stock_total, stock_disponible' });
  }

  const existe = db.libros.find((l) => l.isbn === body.isbn);
  if (existe) {
    return res.status(409).json({ error: 'Ya existe un libro con ese ISBN' });
  }

  const nuevoLibro = {
    id_libro: db.nextIds.libro++,
    isbn: body.isbn,
    titulo: body.titulo,
    anio_publicacion: body.anio_publicacion,
    genero: body.genero,
    stock_total: body.stock_total,
    stock_disponible: body.stock_disponible,
  };

  db.libros.push(nuevoLibro);
  return res.status(201).json(nuevoLibro);
});

// GET /libros/:id_libro - Obtener libro por ID
router.get('/:id_libro', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_libro as string);
  const libro = db.libros.find((l) => l.id_libro === id);

  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  return res.status(200).json(libro);
});

// PUT /libros/:id_libro - Actualizar libro por ID
router.put('/:id_libro', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_libro as string);
  const body: LibroInput = req.body;
  const index = db.libros.findIndex((l) => l.id_libro === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  if (!body.isbn || !body.titulo || body.stock_total === undefined || body.stock_disponible === undefined) {
    return res.status(400).json({ error: 'Campos requeridos: isbn, titulo, stock_total, stock_disponible' });
  }

  db.libros[index] = {
    ...db.libros[index],
    isbn: body.isbn,
    titulo: body.titulo,
    anio_publicacion: body.anio_publicacion,
    genero: body.genero,
    stock_total: body.stock_total,
    stock_disponible: body.stock_disponible,
  };

  return res.status(200).json(db.libros[index]);
});

// DELETE /libros/:id_libro - Eliminar libro por ID
router.delete('/:id_libro', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_libro as string);
  const index = db.libros.findIndex((l) => l.id_libro === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  db.libros.splice(index, 1);
  return res.status(204).send();
});

// GET /libros/:id_libro/autores - Listar autores de un libro
router.get('/:id_libro/autores', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_libro as string);
  const libro = db.libros.find((l) => l.id_libro === id);

  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  const asociaciones = db.librosAutores.filter((la) => la.id_libro === id);
  return res.status(200).json(asociaciones);
});

// POST /libros/:id_libro/autores - Asociar un autor a un libro
router.post('/:id_libro/autores', (req: Request, res: Response) => {
  const id_libro = parseInt(req.params.id_libro as string);
  const body: LibroAutorInput = req.body;

  const libro = db.libros.find((l) => l.id_libro === id_libro);
  if (!libro) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  if (!body.id_autor) {
    return res.status(400).json({ error: 'El campo id_autor es requerido' });
  }

  const autor = db.autores.find((a) => a.id_autor === body.id_autor);
  if (!autor) {
    return res.status(404).json({ error: 'Autor no encontrado' });
  }

  const yaExiste = db.librosAutores.find(
    (la) => la.id_libro === id_libro && la.id_autor === body.id_autor
  );
  if (yaExiste) {
    return res.status(409).json({ error: 'El autor ya está asociado a este libro' });
  }

  const nueva = { id_libro, id_autor: body.id_autor };
  db.librosAutores.push(nueva);
  return res.status(201).json(nueva);
});

// DELETE /libros/:id_libro/autores/:id_autor - Eliminar asociación libro-autor
router.delete('/:id_libro/autores/:id_autor', (req: Request, res: Response) => {
  const id_libro = parseInt(req.params.id_libro as string);
  const id_autor = parseInt(req.params.id_autor as string);

  const index = db.librosAutores.findIndex(
    (la) => la.id_libro === id_libro && la.id_autor === id_autor
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Asociación no encontrada' });
  }

  db.librosAutores.splice(index, 1);
  return res.status(204).send();
});

export default router;
