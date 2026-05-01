# inventario-sena-api

API REST del sistema de inventario de salones y reportes (SENA). Construida con **NestJS 10**, **TypeORM**, **PostgreSQL**, autenticación **JWT** (Passport) y validación con **class-validator**.

Prefijo global de rutas: **`/api`**. CORS habilitado para orígenes del frontend en desarrollo.

## Requisitos

- Node.js 20+
- PostgreSQL 14+ (con `gen_random_uuid()` disponible para migraciones)

## Configuración

1. Copie el ejemplo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

   En Windows PowerShell: `Copy-Item .env.example .env`

2. Edite `.env` con su base de datos y un `JWT_SECRET` seguro (en producción, al menos 32 caracteres).

| Variable | Uso |
|----------|-----|
| `NODE_ENV` | `development` / `production` |
| `PORT` | Puerto HTTP (por defecto `3000`) |
| `DATABASE_*` | Conexión PostgreSQL |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Firma y caducidad del JWT |
| `SEED_ADMIN_*` | Opcional: crea admin inicial si no existe usuario con ese correo |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run start:dev` | Servidor en modo watch |
| `npm run build` | Compila a `dist/` |
| `npm run start` | Arranque sin watch |
| `npm run start:prod` | Ejecuta `node dist/main` (tras `build`) |
| `npm run migration:run` | Aplica migraciones pendientes |
| `npm run migration:revert` | Revierte la última migración |
| `npm run migration:generate -- src/infrastructure/persistence/migrations/Nombre` | Genera migración a partir de cambios en entidades (desarrollo) |

Las migraciones usan el data source en `src/infrastructure/persistence/data-source.ts`.

En plataformas como **Render** o **Heroku**, `npm install` suele ejecutarse con `NODE_ENV=production` y no instala `devDependencies`. Por eso **`@nestjs/cli`**, **`typescript`** y los **`@types/*` necesarios para compilar** están declarados en `dependencies`, para que `npm run build` siga encontrando el comando `nest` y el compilador.

## Desarrollo vs producción

- **`NODE_ENV` distinto de `production`:** TypeORM tiene `synchronize: true` (ajusta el esquema al arrancar). Útil en local; no sustituye migraciones versionadas si varias personas comparten la misma BD.
- **`NODE_ENV=production`:** `synchronize` desactivado. Debe ejecutarse **`npm run migration:run`** antes o al desplegar.

Al arrancar en desarrollo, el **seed** puede crear roles y un administrador inicial según `SEED_ADMIN_*` si aún no existe un usuario con el correo configurado.

## Estructura del código (`src/`)

| Ruta | Contenido |
|------|-----------|
| `modules/` | Módulos Nest: auth, users, roles, classrooms, fichas, inventory, reports |
| `infrastructure/persistence/` | Entidades TypeORM, repositorios, migraciones, `data-source.ts` |
| `infrastructure/seed/` | Datos iniciales (roles, admin) |
| `application/` | Casos de uso / lógica de aplicación compartida |
| `domain/` | Modelos y reglas de dominio |
| `common/` | Guards (JWT, roles), decoradores, utilidades |

## Documentación del proyecto completo

En el repositorio padre: **`README.md`** (instalación fullstack, tabla de endpoints) y **`context.md`** (reglas de negocio y convenciones).

## Licencia

Uso educativo / institucional; alinee la licencia con las políticas de su centro.
