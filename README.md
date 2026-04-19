# Biblioteca API — Node.js + TypeScript

Sistema de gestión de inventarios para biblioteca. Implementa el contrato OpenAPI completo con Express y TypeScript.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

El servidor inicia en `http://localhost:3000`

## Compilar y ejecutar en producción

```bash
npm run build
npm start
```

---

## Endpoints implementados

### Autores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /autores | Listar todos |
| POST | /autores | Crear nuevo |
| GET | /autores/:id | Obtener por ID |
| PUT | /autores/:id | Actualizar |
| DELETE | /autores/:id | Eliminar |
| GET | /autores/:id/libros | Libros de un autor |

### Libros
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /libros | Listar todos |
| POST | /libros | Crear nuevo |
| GET | /libros/:id | Obtener por ID |
| PUT | /libros/:id | Actualizar |
| DELETE | /libros/:id | Eliminar |
| GET | /libros/:id/autores | Autores de un libro |
| POST | /libros/:id/autores | Asociar autor a libro |
| DELETE | /libros/:id/autores/:id_autor | Eliminar asociación |

### Préstamos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /prestamos | Listar todos |
| POST | /prestamos | Registrar préstamo |
| GET | /prestamos/:id | Obtener por ID |
| PUT | /prestamos/:id | Registrar devolución |
| DELETE | /prestamos/:id | Eliminar |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /usuarios | Listar todos |
| POST | /usuarios | Crear nuevo |
| GET | /usuarios/:id | Obtener por ID |
| PUT | /usuarios/:id | Actualizar |
| DELETE | /usuarios/:id | Eliminar |

---

## Estructura del proyecto

```
src/
├── index.ts          # Entrada principal, configuración Express
├── types.ts          # Tipos TypeScript (mapean el OpenAPI)
├── database.ts       # Base de datos en memoria + datos semilla
└── routes/
    ├── autores.ts    # Router /autores
    ├── libros.ts     # Router /libros
    ├── prestamos.ts  # Router /prestamos
    └── usuarios.ts   # Router /usuarios
```

## Lógica de negocio implementada

- **Stock automático**: Al crear un préstamo, `stock_disponible` se descuenta en 1. Al marcar como `devuelto`, se repone.
- **Validaciones 409**: ISBN duplicado, email duplicado, autor ya asociado a libro, sin stock disponible.
- **Validaciones 400**: Campos requeridos según el contrato OpenAPI.
- **Estados de préstamo**: `activo`, `devuelto`, `vencido`.
- **Estados de usuario**: `activo`, `suspendido`.

## Datos semilla incluidos

- **3 autores**: García Márquez, Borges, Allende
- **3 libros**: Cien años de soledad, El Aleph, La casa de los espíritus
- **2 usuarios**: Ana Torres, Carlos Mendoza
- **1 préstamo activo**
