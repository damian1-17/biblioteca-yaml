import { Autor, Libro, LibroAutor, Prestamo, Usuario } from './types';

// ==========================================
// BASE DE DATOS EN MEMORIA
// ==========================================

export const db = {
  autores: [
    { id_autor: 1, nombre: 'Gabriel García Márquez', nacionalidad: 'Colombiana' },
    { id_autor: 2, nombre: 'Jorge Luis Borges', nacionalidad: 'Argentina' },
    { id_autor: 3, nombre: 'Isabel Allende', nacionalidad: 'Chilena' },
  ] as Autor[],

  libros: [
    {
      id_libro: 1,
      isbn: '978-3-16-148410-0',
      titulo: 'Cien años de soledad',
      anio_publicacion: 1967,
      genero: 'Realismo mágico',
      stock_total: 5,
      stock_disponible: 3,
    },
    {
      id_libro: 2,
      isbn: '978-0-14-028329-7',
      titulo: 'El Aleph',
      anio_publicacion: 1949,
      genero: 'Fantástico',
      stock_total: 4,
      stock_disponible: 4,
    },
    {
      id_libro: 3,
      isbn: '978-0-06-093546-9',
      titulo: 'La casa de los espíritus',
      anio_publicacion: 1982,
      genero: 'Realismo mágico',
      stock_total: 3,
      stock_disponible: 2,
    },
  ] as Libro[],

  librosAutores: [
    { id_libro: 1, id_autor: 1 },
    { id_libro: 2, id_autor: 2 },
    { id_libro: 3, id_autor: 3 },
  ] as LibroAutor[],

  prestamos: [
    {
      id_prestamo: 1,
      id_libro: 1,
      id_usuario: 1,
      fecha_prestamo: '2025-04-01',
      fecha_devolucion_esperada: '2025-04-15',
      fecha_devolucion_real: null,
      estado: 'activo' as const,
    },
  ] as Prestamo[],

  usuarios: [
    {
      id_usuario: 1,
      nombre: 'Ana Torres',
      email: 'ana.torres@email.com',
      telefono: '0991234567',
      estado: 'activo' as const,
    },
    {
      id_usuario: 2,
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      telefono: '0987654321',
      estado: 'activo' as const,
    },
  ] as Usuario[],

  // Contadores para IDs auto-incrementales
  nextIds: {
    autor: 4,
    libro: 4,
    prestamo: 2,
    usuario: 3,
  },
};
