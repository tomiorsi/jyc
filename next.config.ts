import type { NextConfig } from "next";

process.env.TZ = process.env.TZ || "America/Argentina/Buenos_Aires";

const esDev = process.env.NODE_ENV !== "production";

/**
 * Política de contenido. El sitio se sirve entero desde su propio dominio,
 * salvo los reels de la landing, que renderizan en un iframe de instagram.com.
 *
 * Es la misma política del portal menos lo que acá no existe: sin los íconos
 * de los medios (no hay sección de noticias) y sin `connect-src` para el
 * backend (este sitio no llama a ninguna API).
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self'",
  "frame-src 'self' https://www.instagram.com",
  ...(esDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
