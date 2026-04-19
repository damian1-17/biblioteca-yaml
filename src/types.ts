// ==========================================
// TIPOS - Biblioteca API
// ==========================================

export interface Autor {
  id_autor: number;
  nombre: string;
  nacionalidad?: string;
}

export interface AutorInput {
  nombre: string;
  nacionalidad?: string;
}

export interface Libro {
  id_libro: number;
  isbn: string;
  titulo: string;
  anio_publicacion?: number;
  genero?: string;
  stock_total: number;
  stock_disponible: number;
}

export interface LibroInput {
  isbn: string;
  titulo: string;
  anio_publicacion?: number;
  genero?: string;
  stock_total: number;
  stock_disponible: number;
}

export interface LibroAutor {
  id_libro: number;
  id_autor: number;
}

export interface LibroAutorInput {
  id_autor: number;
}

export type EstadoPrestamo = 'activo' | 'devuelto' | 'vencido';

export interface Prestamo {
  id_prestamo: number;
  id_libro: number;
  id_usuario: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
  fecha_devolucion_real: string | null;
  estado: EstadoPrestamo;
}

export interface PrestamoInput {
  id_libro: number;
  id_usuario: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
}

export interface PrestamoUpdate {
  fecha_devolucion_real?: string;
  estado?: EstadoPrestamo;
}

export type EstadoUsuario = 'activo' | 'suspendido';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono?: string;
  estado: EstadoUsuario;
}

export interface UsuarioInput {
  nombre: string;
  email: string;
  telefono?: string;
  estado?: EstadoUsuario;
}
