import type { NextConfig } from "next";

process.env.TZ = process.env.TZ || "America/Argentina/Buenos_Aires";

/**
 * Sitio estático puro: sin API routes ni nada dinámico, así que exporta a
 * HTML/CSS/JS sueltos para Cloudflare Pages. Por eso mismo `headers()` no
 * aplica acá — el export estático lo ignora.
 */
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
};

export default nextConfig;
