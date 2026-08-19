"use client";

import { useEffect, useRef } from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  Calculator,
  FileText,
  Handshake,
  Landmark,
  Receipt,
  Scale,
  Search,
  Ship,
  Tags,
  Warehouse,
} from "lucide-react";

/* ───────────────────────── Datos ───────────────────────── */

/** Un servicio: el ícono con el que se lo reconoce, cómo se llama y qué implica. */
type Servicio = {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  titulo: string;
  texto: string;
};

/**
 * Las dos líneas de trabajo del estudio. La separación no es decorativa: son
 * dos servicios que se contratan por separado y a públicos distintos —el
 * despacho lo necesita todo el que importa; el agente de compras, solo el que
 * además quiere que le busquen el proveedor—.
 */
const LINEAS: { nombre: string; items: Servicio[] }[] = [
  {
    nombre: "Liberaciones aduaneras",
    items: [
      {
        Icon: ArrowLeftRight,
        titulo: "Importación y exportación",
        texto:
          "El proceso completo, de la apertura del legajo a la liberación de la mercadería.",
      },
      {
        Icon: Tags,
        titulo: "Clasificación arancelaria",
        texto:
          "Definimos la posición NCM de cada producto y la sostenemos con la documentación técnica.",
      },
      {
        Icon: FileText,
        titulo: "Documentación aduanera",
        texto:
          "Armamos y presentamos el legajo: factura, packing list, transporte, certificados y permisos.",
      },
      {
        Icon: Landmark,
        titulo: "Representación aduanera",
        texto:
          "Actuamos en tu nombre ante la Aduana y resolvemos las observaciones que aparezcan.",
      },
      {
        Icon: Scale,
        titulo: "Asesoría en Incoterms",
        texto:
          "Elegimos con vos el término que mejor reparte costos y riesgos en cada operación.",
      },
      {
        Icon: Receipt,
        titulo: "Gestión de pagos aduaneros",
        texto:
          "Liquidamos derechos, tasas e impuestos, y emitimos los VEP a tiempo.",
      },
      {
        Icon: Warehouse,
        titulo: "Control de inventarios",
        texto:
          "Mercadería en depósito fiscal y zona franca, con el stock conciliado contra lo declarado.",
      },
      {
        Icon: Calculator,
        titulo: "Costeo y factibilidad",
        texto:
          "El costo puesto en tu depósito, calculado antes de que compres.",
      },
    ],
  },
  {
    nombre: "Agente de compras internacionales",
    items: [
      {
        Icon: Search,
        titulo: "Búsqueda de proveedores",
        texto:
          "Proveedores en origen, evaluados con referencias y muestras antes de avanzar.",
      },
      {
        Icon: Handshake,
        titulo: "Negociación de contratos",
        texto:
          "Precio, plazo y garantía cerrados para que un incumplimiento no te deje sin respaldo.",
      },
      {
        Icon: Ship,
        titulo: "Logística internacional",
        texto:
          "Elegimos la vía que mejor equilibra costo y tiempo, y coordinamos el transporte.",
      },
      {
        Icon: BadgeCheck,
        titulo: "Auditoría de proveedores",
        texto:
          "Inspección de calidad en origen, antes del embarque y no cuando ya llegó.",
      },
    ],
  },
];

/**
 * Las mismas líneas con cada servicio numerado. Se numera acá y no al dibujar
 * porque el contador tiene que seguir corriendo de una línea a la otra, y
 * llevarlo con una variable suelta adentro del `map` deja el número atado al
 * orden en que React decida renderizar.
 */
const LINEAS_NUMERADAS = (() => {
  let n = 0;
  return LINEAS.map((linea) => ({
    ...linea,
    items: linea.items.map((item) => ({ ...item, numero: ++n })),
  }));
})();

/* ───────────────────────── El teléfono ───────────────────────── */

/**
 * El mosaico de operaciones, dentro de un teléfono.
 *
 * Los cuatro videos originales —dos de puerto, dos de buque— venían de WhatsApp
 * y sumaban 27 MB. Están fundidos en un solo archivo de ~1 MB: cuatro segundos
 * de cada uno, encadenados con disolvencias y sin audio. Un solo archivo y no
 * cuatro porque cuatro `<video>` en la misma página son cuatro conexiones,
 * cuatro decodificadores y cuatro veces el trabajo de la placa; alternarlos por
 * JavaScript, además, cortaba en seco cada vez que le tocaba a otro.
 *
 * El último segundo vuelve al primer plano, así que el corte del loop cae sobre
 * una disolvencia y no sobre un salto.
 */
function TelefonoOperaciones() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Quien pidió menos movimiento se queda con el póster, que es un cuadro del
    // propio video: la sección no pierde nada y no se descarga 1 MB de más.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `preload="none"` deja el archivo sin tocar hasta que alguien llega a la
    // sección. Quien entra y no baja hasta acá no lo descarga nunca, que es la
    // mayoría de las visitas desde el celular.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );

    observador.observe(video);
    return () => observador.disconnect();
  }, []);

  return (
    <div className="telefono relative mx-auto w-[186px] shrink-0 sm:w-[210px] lg:w-[236px]">
      {/* El resplandor no está en el marco sino detrás: el marco es negro y un
          box-shadow de color sobre negro se lee como suciedad, no como luz. */}
      <div aria-hidden className="telefono-brillo absolute inset-0" />

      <div className="telefono-marco relative aspect-[9/19] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/media/comex-loop.mp4"
          poster="/media/comex-loop-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-label="Operaciones de puerto: buques portacontenedores, grúas y remolcadores"
        />

        {/* La isla de la cámara y el reflejo del vidrio. Los dos son lo que
            hace que se lea como un teléfono y no como un rectángulo redondeado
            con un video adentro. */}
        <span aria-hidden className="telefono-isla" />
        <span aria-hidden className="telefono-vidrio" />
      </div>
    </div>
  );
}

/* ───────────────────────── La sección ───────────────────────── */

/**
 * Servicios: los títulos en una columna y, al lado, qué hace cada uno.
 *
 * Las definiciones arrancan cerradas y se van abriendo solas a medida que la
 * página baja. No hay nada que apretar ni nada que arrastrar: la lista se lee
 * de arriba abajo como una lista, y el scroll —el único gesto que ya está
 * haciendo el visitante— es lo que la va desplegando.
 *
 * El disparador es el mismo `data-reveal` que usa el resto de la landing, que
 * enciende cada elemento cuando cruza el 94 % del alto de la pantalla. Que sea
 * tan abajo importa acá más que en el resto: la fila crece al abrirse, y al
 * hacerlo contra el borde inferior lo que empuja hacia abajo está fuera de la
 * pantalla, así que el salto no se ve.
 */
export function CarruselServicios() {
  return (
    <section id="servicios" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        {/* Es un `h2` y no un párrafo aunque se dibuje chico: es el título de
            la sección, y sin él la página salta de la `h1` del hero a las `h3`
            de cada línea. Ese hueco Google lo lee como una jerarquía rota, y un
            lector de pantalla que navega por encabezados se saltea la sección
            entera. El agregado invisible dice de qué son los servicios, que es
            justo lo que el rótulo no puede decir sin volverse un cartel. */}
        <h2
          data-reveal
          className="landing-reveal text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent-text"
        >
          Servicios
          <span className="sr-only"> de despacho aduanero y comercio exterior</span>
        </h2>

        {/* `lg:items-stretch` no es cosmético: es lo que hace posible que el
            teléfono acompañe a la lista. Con las columnas centradas o alineadas
            arriba, la celda del teléfono mide lo que mide el teléfono, y algo
            pegajoso adentro de una celda de su mismo alto no tiene por dónde
            correrse. Estirada, la celda llega hasta el final de los doce
            servicios y ese es todo el recorrido que el teléfono acompaña. */}
        <div className="mt-10 grid items-center gap-12 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch lg:gap-16">
          <div className="min-w-0">
            {LINEAS_NUMERADAS.map((linea, iLinea) => (
              <div key={linea.nombre} className={iLinea === 0 ? "" : "mt-10"}>
                <div
                  data-reveal
                  className="landing-reveal flex items-center gap-4"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-accent-text">
                    {linea.nombre}
                  </h3>
                  <span aria-hidden className="h-px flex-1 bg-border" />
                </div>

                <ul className="mt-2">
                  {linea.items.map(({ Icon, titulo, texto, numero }, i) => (
                    /* `--retraso` escalona la entrada de las filas que caen
                       juntas: si alguien llega a la sección de un saltó, las
                       ocho aparecen de a una en vez de todas de golpe. Bajando
                       normal casi no se nota, porque cada fila cruza la línea de
                       aparición por su cuenta. La variable la heredan el texto y
                       el ícono, así que la fila entera entra en tiempo. */
                    <li
                      key={titulo}
                      data-reveal
                      style={{ "--retraso": `${i * 55}ms` } as React.CSSProperties}
                      className="servicio-fila grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 border-b border-border/60 py-4 sm:grid-cols-[auto_minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-x-6"
                    >
                      <span className="font-mono text-xs font-semibold leading-7 tracking-[0.14em] text-muted/60">
                        {String(numero).padStart(2, "0")}
                      </span>

                      <h4 className="flex items-center gap-2.5 text-base font-semibold leading-7 text-foreground">
                        {/* Dos capas para el ícono: la caja lleva el flotar
                            continuo y el ícono el salto de entrada. Separadas
                            porque las dos animan la posición, y en un mismo
                            elemento la segunda le pisa el `transform` a la
                            primera. */}
                        <span aria-hidden className="servicio-icono-caja shrink-0">
                          <Icon className="servicio-icono h-[18px] w-[18px]" strokeWidth={1.9} />
                        </span>
                        {titulo}
                      </h4>

                      {/* La definición: cerrada mide cero y no ocupa lugar; al
                            abrirse crece hasta lo que necesite. En pantalla
                            angosta cae debajo del título y se saltea la columna
                            del número, que si no la dejaría partida al medio. */}
                      <div
                        data-reveal
                        className="servicio-definicion col-start-2 sm:col-start-3 sm:row-start-1"
                      >
                        <p className="text-sm leading-relaxed text-muted">
                          {texto}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* El teléfono acompaña a la lista: arranca arriba de todo y se
              queda pegado mientras pasan los doce servicios, hasta que la
              sección se termina y se va con ella.

              Sólo de `lg` para arriba. En pantalla angosta las dos columnas se
              apilan, así que el teléfono queda debajo de la lista y no hay nada
              a lo que acompañar: pegarlo ahí sería tapar el texto con un video.

              El `top` deja el teléfono un poco por debajo del borde superior en
              vez de contra el filo, que es donde se ve como si estuviera
              cortado. */}
          <div
            data-reveal
            style={{ transitionDelay: "90ms" }}
            className="landing-reveal"
          >
            {/* Lo pegajoso va acá adentro y no en la celda: la celda es la que
                tiene que quedarse alta —estirada hasta el final de la lista—
                para que esto tenga por dónde correrse. Si el `sticky` fuera la
                celda misma, mediría lo que mide el teléfono y no se movería. */}
            <div className="lg:sticky lg:top-24">
              <TelefonoOperaciones />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
