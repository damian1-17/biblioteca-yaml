import { Router, Request, Response } from 'express';
import { db } from '../database';
import { UsuarioInput } from '../types';

const router = Router();

// GET /usuarios - Listar todos los usuarios
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(db.usuarios);
});

// POST /usuarios - Crear un nuevo usuario
router.post('/', (req: Request, res: Response) => {
  const body: UsuarioInput = req.body;

  if (!body.nombre || !body.email) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, email' });
  }

  const existe = db.usuarios.find((u) => u.email === body.email);
  if (existe) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
  }

  const nuevoUsuario = {
    id_usuario: db.nextIds.usuario++,
    nombre: body.nombre,
    email: body.email,
    telefono: body.telefono,
    estado: body.estado ?? 'activo' as const,
  };

  db.usuarios.push(nuevoUsuario);
  return res.status(201).json(nuevoUsuario);
});

// GET /usuarios/:id_usuario - Obtener usuario por ID
router.get('/:id_usuario', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_usuario as string);
  const usuario = db.usuarios.find((u) => u.id_usuario === id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.status(200).json(usuario);
});

// PUT /usuarios/:id_usuario - Actualizar usuario por ID
router.put('/:id_usuario', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_usuario as string);
  const body: UsuarioInput = req.body;
  const index = db.usuarios.findIndex((u) => u.id_usuario === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!body.nombre || !body.email) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, email' });
  }

  db.usuarios[index] = {
    ...db.usuarios[index],
    nombre: body.nombre,
    email: body.email,
    telefono: body.telefono,
    estado: body.estado ?? db.usuarios[index].estado,
  };

  return res.status(200).json(db.usuarios[index]);
});

// DELETE /usuarios/:id_usuario - Eliminar usuario por ID
router.delete('/:id_usuario', (req: Request, res: Response) => {
  const id = parseInt(req.params.id_usuario as string);
  const index = db.usuarios.findIndex((u) => u.id_usuario === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  db.usuarios.splice(index, 1);
  return res.status(204).send();
});

export default router;
