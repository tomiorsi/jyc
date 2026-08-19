import type { MetadataRoute } from "next";
import { SITIO } from "./seo";

/**
 * En modo export no hay servidor que ejecute esta función en cada pedido: hay
 * que decirle a Next que la resuelva una sola vez, en el build. Sin esta línea
 * el build directamente falla.
 */
export const dynamic = "force-static";

/**
 * `robots.txt`. Igual que el sitemap, se resuelve en el build y sale como
 * archivo estático.
 *
 * Todo abierto: no hay panel, ni buscador interno, ni rutas de prueba que
 * convenga esconder —es una sola página pública—. Lo único que aporta es la
 * línea del sitemap, que es como los robots que no son de Google lo encuentran
 * sin que nadie se los cargue a mano.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITIO.dominio}/sitemap.xml`,
    host: SITIO.dominio,
  };
}
