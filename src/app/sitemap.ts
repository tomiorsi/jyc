import type { MetadataRoute } from "next";
import { SITIO } from "./seo";

/**
 * En modo export no hay servidor que ejecute esta función en cada pedido: hay
 * que decirle a Next que la resuelva una sola vez, en el build. Sin esta línea
 * el build directamente falla.
 */
export const dynamic = "force-static";

/**
 * El sitemap. Con `output: "export"` Next lo resuelve en el build y deja un
 * `sitemap.xml` estático en `out/`; no hay ningún servidor corriendo detrás.
 *
 * Una sola URL porque el sitio es una sola página. Aun así vale la pena: es lo
 * que se le entrega a Google Search Console para pedir la indexación sin
 * esperar a que el robot llegue solo.
 *
 * Sin `lastModified` con la fecha del build: cambiaría en cada publicación
 * aunque el contenido sea idéntico, y un sitemap que grita «cambié» todos los
 * días sin haber cambiado termina ignorado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITIO.dominio}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
