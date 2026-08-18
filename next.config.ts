import type { NextConfig } from "next";

process.env.TZ = process.env.TZ || "America/Argentina/Buenos_Aires";

/**
 * Sitio estático puro: sin API routes, sin middleware, sin ISR. Todas las rutas
 * salen del build como estáticas, así que exporta a HTML/CSS/JS sueltos y
 * Cloudflare los sirve desde el CDN sin nada corriendo detrás.
 *
 * Dos cosas que se siguen de esto:
 *
 * 1. `headers()` no va acá. El export estático no tiene servidor que las
 *    agregue, así que Next lo ignora en silencio. Las cabeceras —la política de
 *    contenido incluida— viven en `public/_headers`, que Cloudflare aplica.
 *
 * 2. No usar OpenNext para publicar. Empaqueta la app para correr dentro de un
 *    Worker y necesita `.next/standalone`, que el modo export nunca genera: el
 *    build falla buscando `pages-manifest.json`. Y aunque funcionara, pondría un
 *    Worker a ejecutarse en cada visita para devolver HTML ya pre-generado.
 *    El comando de publicación es `next build`, y lo que se sube es `out/`.
 */
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
};

export default nextConfig;
