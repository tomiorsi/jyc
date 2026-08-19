import Image from "next/image";

/**
 * Las couriers cuyos envíos liberamos.
 *
 * Los archivos son los logos originales con el fondo recortado. `ancho` y
 * `alto` son las medidas reales del PNG —next/image las necesita para reservar
 * el espacio y que no salte el layout al cargar— y `altoEnPantalla` es a cuánto
 * se dibuja cada uno.
 *
 * Ese último número va a mano y distinto para cada marca porque las tres tienen
 * proporciones muy diferentes: el escudo de UPS es casi cuadrado y la palabra
 * DHL es siete veces más ancha que alta. Escalarlas todas al mismo alto haría
 * ver a UPS enorme y a DHL diminuta; estos valores las emparejan a ojo.
 *
 * `altoMovil` es el mismo ajuste para pantalla angosta. Los tres tienen que
 * entrar en una sola línea de 375 px, y con las medidas de escritorio no
 * entran ni de cerca: la palabra DHL sola mide 127 px de ancho. Van más chicos,
 * manteniendo entre sí la misma proporción.
 */
const COURIERS = [
  { nombre: "UPS", archivo: "/couriers/ups.png", ancho: 274, alto: 296, altoEnPantalla: 44, altoMovil: 30 },
  { nombre: "DHL", archivo: "/couriers/dhl.png", ancho: 219, alto: 31, altoEnPantalla: 18, altoMovil: 12 },
  { nombre: "FedEx", archivo: "/couriers/fedex.png", ancho: 261, alto: 80, altoEnPantalla: 28, altoMovil: 19 },
];

/**
 * La banda de couriers: corta la superficie continua de la página a propósito,
 * como una parada en medio del recorrido.
 *
 * El naranja no es plano. Encima corren dos capas —la trama de puntos y un
 * remolino de color que gira— más una luz que va y viene de lado a lado. Las
 * tres son muy tenues: la banda tiene que respirar, no destellar, y arriba
 * lleva texto que no puede competir con el fondo.
 *
 * Las puntas de arriba van cuadradas mientras la pantalla es angosta: ahí
 * la banda no arranca sola sino pegada a la franja de video de Servicios, y
 * las dos son un solo bloque. Redondear las cuatro puntas dejaría una
 * costura a la vista justo en la unión.
 *
 * Antes había además un resplandor que seguía al cursor. Se fue: el efecto solo
 * existía para quien tuviera mouse —en celular, la mitad del tráfico, la banda
 * quedaba muerta— y obligaba a escuchar `pointermove` sobre un bloque enorme
 * para mover una luz que nadie estaba mirando.
 */
export function BandaCourier() {
  return (
    <section
      id="courier"
      className="courier-banda relative overflow-hidden rounded-b-3xl bg-[var(--banda-fondo)] lg:rounded-3xl"
    >
      {/* El remolino va primero y bien atrás: es el color moviéndose, y todo lo
          demás se apoya encima. */}
      <div aria-hidden className="courier-remolino absolute" />
      <div aria-hidden className="courier-vaiven absolute inset-0" />
      <div aria-hidden className="courier-textura absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div data-reveal className="landing-reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--banda-texto)]/70">
              Courier internacional
            </p>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-[var(--banda-texto)] sm:text-3xl">
              Liberamos tus envíos retenidos
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--banda-texto)]/80 sm:text-base">
              Retiramos tu paquetería de la Aduana y te la entregamos liberada,
              sin importar con cuál llegó.
            </p>
          </div>

          {/* Los logos van sobre chapas blancas y no sueltos sobre el naranja:
              cada marca trae sus propios colores —el rojo de DHL, el violeta de
              FedEx, el marrón de UPS— y encima del acento se ensucian entre sí.
              El blanco les da a las tres el fondo neutro para el que fueron
              diseñadas.

              Las chapas no comparten ancho, sólo altura: con ancho fijo, DHL
              quedaba comprimida y se dibujaba más chica que las otras dos.

              En celular van en una sola línea (`flex-nowrap`) y por eso todo se
              achica: la chapa, su relleno, el hueco entre chapas y los tres
              logos. Con las medidas de escritorio, FedEx caía sola a una
              segunda fila. */}
          <ul
            data-reveal
            style={{ transitionDelay: "90ms" }}
            className="landing-reveal flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-4"
          >
            {COURIERS.map(({ nombre, archivo, ancho, alto, altoEnPantalla, altoMovil }, i) => (
              <li
                key={nombre}
                className="courier-chapa flex h-[56px] min-w-[60px] items-center justify-center rounded-2xl bg-white px-3 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.45)] sm:h-[74px] sm:min-w-[104px] sm:px-6"
                style={{ animationDelay: `${i * 1.1}s` }}
              >
                <Image
                  src={archivo}
                  alt={nombre}
                  width={ancho}
                  height={alto}
                  style={
                    {
                      "--logo-alto": `${altoEnPantalla}px`,
                      "--logo-alto-movil": `${altoMovil}px`,
                    } as React.CSSProperties
                  }
                  className="courier-logo object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
