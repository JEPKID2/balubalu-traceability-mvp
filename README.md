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
- Ruta administrativa `/admin` con tabla, filtros, métricas y mapa básico.

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

Ejemplo con parámetros QR:

- `http://localhost:3000/?qr=BALU-QR-1001&lot=LOTE-UR-2026-002`

## Build de producción

```bash
npm run build
npm run start
```

## Estructura clave

- `app/page.tsx`: flujo principal de la experiencia.
- `app/api/scans/route.ts`: endpoints internos del backend.
- `app/admin/page.tsx`: entrada del dashboard.
- `components/`: pantallas y módulos UI.
- `lib/data/scan-repository.ts`: capa de repositorio intercambiable.
- `lib/utils/`: utilidades como distancia, fecha y guardado.
- `lib/data/scans.json`: almacenamiento temporal MVP.

## Notas técnicas

- El origen está fijo en Apartadó, Urabá, Colombia con coordenadas `7.883, -76.633`.
- Si el usuario no acepta la geolocalización, la experiencia sigue con un destino simbólico internacional.
- El backend intenta enriquecer el registro con una etiqueta de ubicación usando reverse geocoding y hace fallback seguro si falla.
- El almacenamiento en JSON funciona para demos locales, pero no es suficiente para despliegues serverless o multiinstancia.

## Mejoras recomendadas

- Migrar el repositorio a PostgreSQL, MySQL o Supabase.
- Proteger `/admin` con autenticación y roles.
- Reemplazar el mapa Leaflet por un globo 3D con Three.js o React Three Fiber.
- Enriquecer la trazabilidad con puertos, navieras, hitos logísticos y tiempos estimados.
- Agregar branding real de Balú con logo, fotos de finca y assets propios.
- Añadir analítica, rate limiting y validación más estricta del payload.
- Persistir media y eventos para storytelling adicional por lote o finca.
