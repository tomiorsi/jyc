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

Todo lo que Google lee sale de `src/app/seo.ts`: el dominio, el teléfono, la
dirección y las redes. **Confirmar que el dominio de ahí es el real** — de él
salen la canónica, el `sitemap.xml`, el `robots.txt`, la ficha para compartir y
los datos estructurados, y si apunta a otro lado Google indexa el sitio
equivocado.

Después de publicar, dar de alta el sitio en Google Search Console y cargarle
`https://<dominio>/sitemap.xml`: es lo que hace que Google pase en días en vez
de en semanas.

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
src/app/seo.ts          dominio, dirección y teléfono — la fuente de todo el SEO
src/app/sitemap.ts      sitemap.xml (se genera en el build)
src/app/robots.ts       robots.txt (idem)
src/app/page.tsx        renderiza <Landing />
src/app/globals.css     los tokens y utilidades (idéntico al portal)
src/components/brand.tsx
src/components/datos-estructurados.tsx   el JSON-LD del estudio
src/components/landing/
  landing.tsx              hero, rubros, pie
  carrusel-servicios.tsx   los doce servicios y el teléfono con el video
  banda-courier.tsx        la franja naranja
  mapa-oficina.tsx         el plano de Monserrat
  world-routes.tsx         el mapa animado del hero
  world-dots.ts
  instagram-posts.tsx      los reels embebidos
public/jc-logo.svg         claro y oscuro
public/media/              el loop de operaciones, su póster y la imagen de OG
source/videos/             los originales de los que sale el loop (fuera de git)
```
