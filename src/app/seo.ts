/**
 * Los datos del estudio, en un solo lugar.
 *
 * Todo lo que Google lee sale de acá: el título y la descripción de la página,
 * la ficha que se ve al compartir el enlace, el sitemap y los datos
 * estructurados. Está junto y no repartido porque son los mismos cuatro datos
 * —nombre, dirección, teléfono, dominio— escritos en cinco formatos distintos,
 * y desincronizarlos es peor que no tenerlos: Google marca como sospechoso al
 * sitio cuyo JSON-LD dice una dirección y cuyo texto dice otra.
 *
 * SI CAMBIA EL DOMINIO, se cambia acá y nada más.
 */

export const SITIO = {
  dominio: "https://jyccomex.com.ar",
  nombre: "J&C Comex",
  nombreLargo: "J&C Comex · Despachantes de Aduana",
  /** El WhatsApp del estudio, en formato internacional para el JSON-LD. */
  telefono: "+54 9 11 3055-9538",
  whatsapp: "https://wa.me/5491130559538",
  instagram: "https://www.instagram.com/jyccomex",
  calle: "Perú 359",
  barrio: "Monserrat",
  ciudad: "Ciudad Autónoma de Buenos Aires",
  provincia: "CABA",
  codigoPostal: "C1067",
  pais: "AR",
} as const;

/**
 * La descripción que sale abajo del título en el resultado de búsqueda.
 *
 * Está escrita para que se entienda leída sola, sin la página: Google la corta
 * cerca de los 155 caracteres, así que lo que define al estudio —qué hace, para
 * quién y dónde— va adelante.
 */
export const DESCRIPCION =
  "Estudio de despachantes de aduana en Buenos Aires con más de 20 años. " +
  "Gestionamos importaciones y exportaciones de punta a punta: clasificación " +
  "arancelaria, documentación, representación ante la Aduana y agente de compras.";
