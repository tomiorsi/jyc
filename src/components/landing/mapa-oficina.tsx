"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { MAPA_ALTO, MAPA_ANCHO, ROTULOS, VIAS } from "@/components/landing/mapa-calles";

const DIRECCION = "Perú 359, CABA, Argentina";
const EN_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  DIRECCION,
)}`;

/** Grosor del trazo según el rango de la calle: avenida ancha, calle fina. */
const GROSOR = [6, 4.2, 3.2, 2.2];

/**
 * El mapa de la oficina, dibujado con las calles reales de Monserrat.
 *
 * El plano está acostado en perspectiva y gira muy despacio sobre su propio
 * eje. La rotación la maneja el scroll, no un temporizador: mientras el bloque
 * cruza la pantalla el plano se endereza unos grados, así que el 3D se siente
 * al recorrer la página en vez de moverse solo mientras nadie mira.
 */
export function MapaOficina() {
  const cajaRef = useRef<HTMLDivElement>(null);
  const planoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = cajaRef.current;
    const plano = planoRef.current;
    if (!caja || !plano) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pedido = 0;

    const acomodar = () => {
      pedido = 0;
      const r = caja.getBoundingClientRect();
      // 0 cuando el bloque recién asoma por abajo, 1 cuando terminó de salir
      // por arriba. Fuera de ese rango no hay nada que actualizar.
      const avance = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      if (avance < -0.1 || avance > 1.1) return;
      const t = Math.min(1, Math.max(0, avance));
      const inclinacion = 46 - t * 26;
      const giro = -12 + t * 24;
      const alturaCamara = 1500 - t * 260;
      plano.style.transform =
        `translate(-50%, -50%) perspective(${alturaCamara}px) ` +
        `rotateX(${inclinacion}deg) rotateZ(${giro}deg) scale(1.02)`;
    };

    const alScrollear = () => {
      if (!pedido) pedido = requestAnimationFrame(acomodar);
    };

    acomodar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      cancelAnimationFrame(pedido);
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, []);

  return (
    <section id="donde-estamos" className="relative">
      <div
        ref={cajaRef}
        className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-20 sm:px-8 sm:pb-28"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface">
          {/* El plano. Se dibuja más grande que su recuadro y desbordado a
              propósito: al acostarlo en perspectiva, el borde de arriba se
              aleja y dejaría ver dónde termina el dibujo. */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={planoRef}
              className="mapa-plano absolute left-1/2 top-1/2 h-[240%] w-[150%]"
            >
              <svg
                viewBox={`0 0 ${MAPA_ANCHO} ${MAPA_ALTO}`}
                className="h-full w-full"
                aria-hidden
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {ROTULOS.map(({ i }) => (
                    <path key={i} id={`via-${i}`} d={VIAS[i].d} fill="none" />
                  ))}
                </defs>

                <g
                  className="mapa-calles"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {VIAS.map((v, i) => (
                    <path key={i} d={v.d} strokeWidth={GROSOR[v.r]} />
                  ))}
                </g>

                {/* Los nombres siguen la curva de su propia calle, como en un
                    plano de papel. */}
                <g className="mapa-rotulos">
                  {ROTULOS.map(({ i, n }) => (
                    <text key={i} fontSize="19" letterSpacing="2.2">
                      <textPath href={`#via-${i}`} startOffset="42%" textAnchor="middle">
                        {n.toUpperCase()}
                      </textPath>
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Difuminado hacia los bordes, para que el plano no termine en un
              corte recto contra el recuadro. Va ANTES de la chapa: al revés la
              tapaba, que es justo lo único que no tiene que difuminarse. */}
          <div aria-hidden className="mapa-velo pointer-events-none absolute inset-0" />

          {/* La chapa del lugar. No se mueve con el plano: es el único punto
              quieto, y por eso se lee como el lugar y no como parte del dibujo.
              Cae en el centro del recuadro porque el plano se proyectó centrado
              en la oficina y gira sobre ese mismo punto. */}
          <div className="mapa-chapa pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <div className="relative flex min-h-[210px] items-center px-6 py-10 sm:min-h-[270px] sm:px-12 sm:py-12">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
                Dónde estamos
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Perú 359, <span className="text-accent-text">Monserrat.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                A pocas cuadras de la Aduana. Si preferís verlo en persona,
                coordinamos y te esperamos.
              </p>
              <a
                href={EN_MAPS}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent-text"
              >
                Abrir en Google Maps
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
