# J&C Comex — web pública

La landing del estudio. **Solo la landing**: acá no hay sesión, ni API, ni base
de datos. El software vive en otro dominio.

Es una copia exacta de la landing del portal, con la misma hoja de estilos y los
mismos componentes. Lo único que cambia:

| | Portal | Acá |
|---|---|---|
| Botón del encabezado | «Registrarme» / «Ingresar» | «Contacto» |
| CTA «¿Querés acceder a todo esto?» | iba a `/reunion` | va a `CONTACTO` |
| `<title>` | Portal de Comercio Exterior | J&C Comex · Despachantes de Aduana |

## ⚠️ Antes de publicar

En `src/components/landing/landing.tsx`, arriba de todo:

```ts
const CONTACTO = "https://wa.me/54900000000";
```

**Poner el WhatsApp o el mail real del estudio.** Es el destino de los dos
botones de contacto.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Publicar

`npm run build` genera la home **estática** (`○ /` prerendered). O sea que se
puede hostear en cualquier lado: Cloudflare Pages, Vercel, Netlify o el mismo
VPS. No hace falta un servidor Node corriendo.

## Estructura

```
src/app/layout.tsx      fuentes, metadata y el script que aplica el tema
src/app/page.tsx        renderiza <Landing />
src/app/globals.css     los tokens y utilidades (idéntico al portal)
src/components/brand.tsx
src/components/landing/
  landing.tsx           hero, portal, proceso
  world-routes.tsx      el mapa animado
  world-dots.ts
  instagram-posts.tsx   los reels embebidos
public/jc-logo.svg      claro y oscuro
```
