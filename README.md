# BalúBalú Traceability MVP

MVP experiencial construido con Next.js App Router, React, TypeScript, Tailwind CSS, Leaflet y Remotion para visualizar el recorrido de una caja Balú desde Apartadó, Urabá, Colombia, hasta el lugar donde se escanea un código QR.

## Qué incluye

- Landing inmersiva tipo presentación full-screen.
- Solicitud de geolocalización con manejo de permisos aceptados, rechazados o no disponibles.
- Endpoint `POST /api/scans` para registrar escaneos.
- Endpoint `GET /api/scans` para consultar registros.
- Persistencia MVP en archivo JSON local con arquitectura lista para migrar a PostgreSQL, MySQL o Supabase.
- Animación de trazabilidad con Leaflet.
- Animación de crecimiento agrícola usando Remotion Player.
- Ruta administrativa `/admin` con tabla, filtros, métricas, mapa básico y acceso protegido.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- React Leaflet + OpenStreetMap
- Remotion + `@remotion/player`
- Framer Motion

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Aplicación principal:

- `http://localhost:3000`

Dashboard:

- `http://localhost:3000/admin`
- `http://localhost:3000/admin/login`

Ejemplo con parámetros QR:

- `http://localhost:3000/?qr=BALU-QR-1001&lot=LOTE-UR-2026-002`

## Build de producción

```bash
npm run build
npm run start
```

## Autenticación del dashboard admin

La ruta `/admin` está protegida por sesión y roles.

### Variables de entorno

Crea un archivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Variables:

- `BALU_AUTH_SECRET`: secreto para firmar la cookie de sesión.
- `BALU_AUTH_USERS`: arreglo JSON de usuarios autorizados.

Ejemplo:

```env
BALU_AUTH_SECRET=super-secret-balu
BALU_AUTH_USERS=[{"username":"admin","password":"mi-clave-segura","role":"admin","displayName":"Administrador Balú"},{"username":"analyst","password":"otra-clave","role":"analyst","displayName":"Analista Balú"}]
```

Roles soportados:

- `admin`: acceso completo al dashboard.
- `analyst`: acceso al dashboard.
- `viewer`: autenticado pero sin acceso a `/admin`.

### Credenciales por defecto en desarrollo

Si no configuras `BALU_AUTH_USERS` y estás en desarrollo, el proyecto habilita este acceso local:

- usuario: `admin`
- contraseña: `balu12345`
- rol: `admin`

Antes de producción, configura usuarios reales y un secreto fuerte.

## Estructura clave

- `app/page.tsx`: flujo principal de la experiencia.
- `app/api/scans/route.ts`: endpoints internos del backend.
- `app/admin/page.tsx`: entrada del dashboard.
- `app/admin/login/page.tsx`: acceso autenticado al dashboard.
- `components/`: pantallas y módulos UI.
- `lib/auth/session.ts`: autenticación, sesión y control de roles.
- `lib/data/scan-repository.ts`: capa de repositorio intercambiable.
- `lib/utils/`: utilidades como distancia, fecha y guardado.
- `lib/data/scans.json`: almacenamiento temporal MVP.

## Notas técnicas

- El origen está fijo en Apartadó, Urabá, Colombia con coordenadas `7.883, -76.633`.
- Si el usuario no acepta la geolocalización, la experiencia sigue con un destino simbólico internacional.
- El backend intenta enriquecer el registro con una etiqueta de ubicación usando reverse geocoding y hace fallback seguro si falla.
- El almacenamiento en JSON funciona para demos locales, pero no es suficiente para despliegues serverless o multiinstancia.
- La autenticación actual está pensada como base MVP; en producción conviene migrar a un proveedor formal de identidad o SSO.

## Mejoras recomendadas

- Migrar el repositorio a PostgreSQL, MySQL o Supabase.
- Reemplazar el mapa Leaflet por un globo 3D con Three.js o React Three Fiber.
- Enriquecer la trazabilidad con puertos, navieras, hitos logísticos y tiempos estimados.
- Agregar branding real de Balú con logo, fotos de finca y assets propios.
- Añadir analítica, rate limiting y validación más estricta del payload.
- Persistir media y eventos para storytelling adicional por lote o finca.
