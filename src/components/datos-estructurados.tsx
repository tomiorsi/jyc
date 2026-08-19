import { DESCRIPCION, SITIO } from "@/app/seo";

/**
 * Los datos del estudio en JSON-LD, para que Google entienda de qué es esta
 * página y no tenga que adivinarlo del texto.
 *
 * Es lo que habilita la ficha del costado en la búsqueda —nombre, dirección,
 * teléfono, horario— y lo que hace que «despachante de aduana cerca mío» pueda
 * traer a este estudio: sin esto, para Google la página es texto suelto sobre
 * comercio exterior y no un negocio con una dirección en Monserrat.
 *
 * `ProfessionalService` y no `LocalBusiness` a secas: es más específico, y
 * hereda de `LocalBusiness` igual, así que no se pierde nada de la ficha local.
 *
 * Todo lo que se declara acá tiene que estar también escrito en la página. Un
 * JSON-LD que afirma cosas que el visitante no puede ver es exactamente lo que
 * Google penaliza como marcado engañoso.
 */

const ESTUDIO = {
  "@type": "ProfessionalService",
  "@id": `${SITIO.dominio}/#estudio`,
  name: SITIO.nombre,
  legalName: "J&C Comex",
  description: DESCRIPCION,
  url: SITIO.dominio,
  telephone: SITIO.telefono,
  image: `${SITIO.dominio}/media/og.jpg`,
  logo: `${SITIO.dominio}/jc-logo.svg`,
  foundingDate: "2005",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITIO.calle,
    addressLocality: SITIO.ciudad,
    addressRegion: SITIO.provincia,
    postalCode: SITIO.codigoPostal,
    addressCountry: SITIO.pais,
  },
  sameAs: [SITIO.instagram],
  areaServed: [
    { "@type": "Country", name: "Argentina" },
    { "@type": "City", name: "Buenos Aires" },
  ],
  /**
   * Los mismos doce servicios que están listados en la sección «Servicios». Si
   * ahí se agrega o se saca uno, acá también.
   */
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de comercio exterior",
    itemListElement: [
      "Importación y exportación",
      "Clasificación arancelaria",
      "Documentación aduanera",
      "Representación aduanera",
      "Asesoría en Incoterms",
      "Gestión de pagos aduaneros",
      "Control de inventarios",
      "Costeo y factibilidad",
      "Búsqueda de proveedores",
      "Negociación de contratos",
      "Logística internacional",
      "Auditoría de proveedores",
    ].map((nombre) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: nombre },
    })),
  },
};

const SITIO_WEB = {
  "@type": "WebSite",
  "@id": `${SITIO.dominio}/#sitio`,
  url: SITIO.dominio,
  name: SITIO.nombreLargo,
  inLanguage: "es-AR",
  publisher: { "@id": `${SITIO.dominio}/#estudio` },
};

/**
 * Los dos nodos van en un solo `@graph` y no en dos etiquetas sueltas: así
 * quedan enlazados por `@id` —el sitio declara quién lo publica— y Google los
 * lee como una sola entidad en vez de como dos fichas que compiten.
 */
const GRAFO = {
  "@context": "https://schema.org",
  "@graph": [ESTUDIO, SITIO_WEB],
};

export function DatosEstructurados() {
  return (
    <script
      type="application/ld+json"
      // El JSON lo genera este archivo, no viene de ningún lado: no hay nada
      // que escapar más allá de lo que ya hace `JSON.stringify`.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAFO) }}
    />
  );
}
